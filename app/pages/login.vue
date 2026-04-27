<script setup lang="ts">
import { z } from 'zod'
import type { Database } from '~/types/database.types'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address')
})

type LoginFormState = Partial<z.input<typeof loginSchema>>

const state = ref<LoginFormState>({
  email: ''
})

const supabase = useSupabaseClient<Database>()
const toast = useAppToast()
const isLoading = ref(false)
const submittedEmail = ref<string | null>(null)

async function submit() {
  if (!state.value.email || isLoading.value) {
    return
  }

  try {
    isLoading.value = true

    const { error } = await supabase.auth.signInWithOtp({
      email: state.value.email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`
      }
    })

    if (error) {
      throw error
    }

    submittedEmail.value = state.value.email
  } catch (error) {
    const description = error instanceof Error ? error.message : 'Could not send the login email.'

    toast.error({
      title: 'Could not send login email',
      description
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <UContainer class="flex min-h-screen items-center justify-center py-10">
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="space-y-1">
          <h1 class="text-2xl font-bold">Log in</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Enter your email to continue.
          </p>
        </div>
      </template>

      <div v-if="submittedEmail" class="space-y-3">
        <h2 class="text-lg font-semibold">Email sent</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Email sent to {{ submittedEmail }}.
        </p>
      </div>

      <UForm v-else :state="state" :schema="loginSchema" class="space-y-4" @submit="submit">
        <UFormField label="Email" required name="email">
          <UInput
            v-model="state.email"
            type="email"
            placeholder="name@example.com"
            class="w-full"
            :disabled="isLoading"
          />
        </UFormField>

        <UButton type="submit" block :loading="isLoading" :disabled="isLoading">
          Log in
        </UButton>
      </UForm>
    </UCard>
  </UContainer>
</template>
