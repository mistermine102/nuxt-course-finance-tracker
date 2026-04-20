<script setup lang="ts">
const user = useSupabaseUser()

const avatarUrl = computed(() => {
  const metadata = user.value?.user_metadata

  return metadata?.avatar_url ?? metadata?.picture ?? null
})

const avatarAlt = computed(() => {
  return user.value?.email ?? 'Current user avatar'
})
</script>

<template>
  <header class="flex items-center justify-between py-8">
    <NuxtLink to="/" class="text-2xl font-bold">
      Finance Tracker
    </NuxtLink>

    <UButton
      v-if="!user"
      to="/login"
      color="neutral"
      variant="ghost"
    >
      Log in
    </UButton>

    <UAvatar
      v-else
      :src="avatarUrl ?? undefined"
      :alt="avatarAlt"
      size="xl"
    />
  </header>
</template>
