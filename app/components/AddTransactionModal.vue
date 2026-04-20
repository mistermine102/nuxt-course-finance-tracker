<script setup lang="ts">
const props = withDefaults(defineProps<{
  open?: boolean
}>(), {
  open: false
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  transactionAdded: []
}>()

const open = computed({
  get: () => props.open,
  set: value => emit('update:open', value)
})

function handleTransactionAdded() {
  open.value = false
  emit('transactionAdded')
}
</script>

<template>
  <UModal v-model:open="open" title="Add transaction">
    <template #body>
      <TransactionForm @transaction-added="handleTransactionAdded" />
    </template>
  </UModal>
</template>
