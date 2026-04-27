<script setup lang="ts">
const settingsLinks = [
  {
    label: 'Profile',
    icon: 'i-heroicons-user-circle',
    to: '/settings/profile'
  },
  {
    label: 'Avatar',
    icon: 'i-heroicons-photo',
    to: '/settings/avatar'
  },
  {
    label: 'Settings',
    icon: 'i-heroicons-cog-6-tooth',
    to: '/settings/settings'
  }
]
</script>

<template>
  <UContainer class="py-10">
    <div class="grid gap-8 md:grid-cols-[220px_minmax(0,1fr)]">
      <aside>
        <UVerticalNavigation :items="settingsLinks" />
      </aside>

      <section class="min-h-[260px]">
        <NuxtPage />
      </section>
    </div>
  </UContainer>
</template>
