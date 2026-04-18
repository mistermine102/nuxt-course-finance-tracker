<script setup lang="ts">
import { categories, types } from '~/constants';

const props = withDefaults(defineProps<{
  open?: boolean
}>(), {
  open: false
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const open = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
})

</script>

<template>
  <UModal v-model:open="open" title="Add transaction">
    <template #body>
      <UFormField label="Transaction type" required name="type" class="mb-4">
        <USelect placeholder="Transaction type" :items="types" />
      </UFormField>

      <UFormField label="Amount" required name="Amount" class="mb-4">
        <UInput type="number" placeholder="Amount" />
      </UFormField>

      <UFormField label="Transaction date" required name="created_at" class="mb-4">
        <UInput type="date" placeholder="Transaction date" />
      </UFormField>

      <UFormField label="Description" name="description" class="mb-4">
        <UInput placeholder="Description" />
      </UFormField>

      <UFormField label="Category" required name="category" class="mb-4">
        <USelect placeholder="Category" :items="categories" />
      </UFormField>
    </template>
  </UModal>
</template>
