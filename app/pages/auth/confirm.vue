<script setup lang="ts">
const user = useSupabaseUser()

const authError = ref<string | null>(null)

onMounted(() => {
  const hash = new URLSearchParams(window.location.hash.slice(1))
  authError.value = hash.get('error_description') ?? hash.get('error')
})

const status = computed<'loading' | 'success' | 'error'>(() => {
  if (authError.value) return 'error'
  if (user.value) return 'success'
  return 'loading'
})
</script>

<template>
  <UContainer class="flex min-h-screen items-center justify-center py-10">
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="space-y-1 text-center">
          <h1 class="text-2xl font-bold">Magic Link Login</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Confirming your secure sign-in link.
          </p>
        </div>
      </template>

      <div v-if="status === 'loading'" class="space-y-4 text-center">
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
          <UIcon name="i-heroicons-arrow-path" class="h-6 w-6 animate-spin text-neutral-600 dark:text-neutral-300" />
        </div>
        <div class="space-y-1">
          <h2 class="text-lg font-semibold">Verifying link</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Finishing your sign-in...</p>
        </div>
      </div>

      <div v-else-if="status === 'success'" class="space-y-4 text-center">
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <UIcon name="i-heroicons-check" class="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <div class="space-y-1">
          <h2 class="text-lg font-semibold">You are logged in</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            You are now signed in as {{ user?.email }}.
          </p>
        </div>
        <UButton to="/" block>
          Continue
        </UButton>
      </div>

      <div v-else class="space-y-4 text-center">
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <UIcon name="i-heroicons-x-mark" class="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <div class="space-y-1">
          <h2 class="text-lg font-semibold">Could not log you in</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ authError }}</p>
        </div>
        <UButton to="/login" color="neutral" variant="soft" block>
          Back to login
        </UButton>
      </div>
    </UCard>
  </UContainer>
</template>
