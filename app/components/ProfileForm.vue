<script setup lang="ts">
import { z } from 'zod'
import type { User } from '@supabase/supabase-js'
import type { JwtPayload } from '@supabase/auth-js'
import type { Database } from '~/types/database.types'

type ProfileUser = User | JwtPayload

const props = defineProps<{
  user: ProfileUser
}>()

const profileSchema = z.object({
  username: z.string().trim().min(1, 'Username is required').max(50, 'Username is too long'),
  email: z.string().email('Please enter a valid email address')
})

type ProfileFormState = z.input<typeof profileSchema>

const supabase = useSupabaseClient<Database>()
const currentUser = useSupabaseUser()
const toast = useAppToast()

const isLoading = ref(false)

const getProfileFormState = (user: ProfileUser): ProfileFormState => ({
  username: typeof user.user_metadata?.username === 'string' ? user.user_metadata.username : '',
  email: user.email ?? ''
})

const state = ref<ProfileFormState>(getProfileFormState(props.user))

watch(
  () => props.user,
  (user) => {
    state.value = getProfileFormState(user)
  }
)

async function updateProfile() {
  if (isLoading.value) {
    return
  }

  try {
    isLoading.value = true
    const username = state.value.username.trim()
    const email = state.value.email.trim()

    const { data, error } = await supabase.auth.updateUser(
      {
        ...(email !== props.user.email ? { email } : {}),
        data: {
          ...props.user.user_metadata,
          username
        }
      },
      { emailRedirectTo: `${window.location.origin}/auth/confirm` }
    )

    if (error) {
      throw error
    }

    const { data: refreshedData } = await supabase.auth.getUser()
    const updatedUser = refreshedData.user ?? data.user

    if (updatedUser) {
      currentUser.value = {
        ...currentUser.value,
        sub: updatedUser.id,
        email: updatedUser.email,
        user_metadata: updatedUser.user_metadata
      } as typeof currentUser.value
    }

    toast.success({
      title: 'Profile updated'
    })
  } catch (error) {
    const description = error instanceof Error ? error.message : 'Could not update your profile.'

    toast.error({
      title: 'Could not update profile',
      description
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <UCard class="max-w-xl">
    <template #header>
      <div class="space-y-1">
        <h1 class="text-xl font-semibold">Profile</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Update your username and email address.
        </p>
      </div>
    </template>

    <UForm :state="state" :schema="profileSchema" class="space-y-4" @submit="updateProfile">
      <UFormField label="Username" required name="username">
        <UInput
          v-model="state.username"
          placeholder="Your username"
          class="w-full"
          :disabled="isLoading"
        />
      </UFormField>

      <UFormField label="Email address" required name="email">
        <UInput
          v-model="state.email"
          type="email"
          placeholder="name@example.com"
          class="w-full"
          :disabled="isLoading"
        />
      </UFormField>

      <div class="flex justify-end">
        <UButton type="submit" :loading="isLoading" :disabled="isLoading">
          Save changes
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>
