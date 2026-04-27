<script setup lang="ts">
defineProps<{
  items: Array<Record<string, unknown>>
}>()
</script>

<template>
  <UNavigationMenu
    :items="items"
    orientation="vertical"
    highlight
    class="w-full"
  />
</template>
