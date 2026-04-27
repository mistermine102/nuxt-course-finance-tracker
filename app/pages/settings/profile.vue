<script setup lang="ts">
const user = useSupabaseUser()
</script>

<template>
  <ProfileForm
    v-if="user"
    :key="`${user.id}:${user.email ?? ''}:${(user.user_metadata?.username as string | undefined) ?? ''}`"
    :user="user"
  />

  <UCard v-else class="max-w-xl">
    <template #header>
      <div class="space-y-1">
        <h1 class="text-xl font-semibold">Profile</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Sign in to update your account details.
        </p>
      </div>
    </template>

    <UButton to="/login" color="neutral" variant="soft">
      Go to login
    </UButton>
  </UCard>
</template>
