<script setup lang="ts">
const user = useSupabaseUser()
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

    <UserAvatarMenu v-else :user="user" />
  </header>
</template>
