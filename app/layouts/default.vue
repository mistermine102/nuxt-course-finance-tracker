<template>
  <div class="container mx-auto max-w-4xl">
    <AppHeader />
    <slot />
  </div>
</template>

<script setup lang="ts">

useHead({
  title: 'Finance Tracker',
  meta: [
    { name: 'description', content: 'Finance Tracker' }
  ],
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' }
  ]
})

</script>

<style>
body {
  font-family: 'Inter', sans-serif;
}
</style>