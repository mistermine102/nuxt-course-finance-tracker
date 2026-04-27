<script setup lang="ts">
import { z } from 'zod'
import type { User } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

const props = defineProps<{
  user: User
}>()

const profileSchema = z.object({
  username: z.string().trim().min(1, 'Username is required').max(50, 'Username is too long'),
  email: z.string().email('Please enter a valid email address')
})

type ProfileFormState = z.input<typeof profileSchema>

const supabase = useSupabaseClient<Database>()
const toast = useAppToast()

const isLoading = ref(false)
const currentUsername = (props.user.user_metadata?.username as string | undefined) ?? ''

const state = ref<ProfileFormState>({
  username: currentUsername,
  email: props.user.email ?? ''
})

async function updateProfile() {
  if (isLoading.value) {
    return
  }

  try {
    isLoading.value = true

    const { error } = await supabase.auth.updateUser(
      {
        email: state.value.email,
        data: {
          ...props.user.user_metadata,
          username: state.value.username
        }
      },
      { emailRedirectTo: `${window.location.origin}/auth/confirm` }
    )

    if (error) {
      throw error
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
