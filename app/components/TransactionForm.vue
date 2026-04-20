<script setup lang="ts">
import { categories, types } from '~/constants'
import { transactionSchema, createTransactionFormState } from '~/composables/useTransactions'
import type { TablesInsert } from '~/types/database.types'

const emit = defineEmits<{
  transactionAdded: []
}>()

const state = ref(createTransactionFormState())
const { addTransaction, isLoading } = useAddTransaction({
  onSuccess: () => emit('transactionAdded')
})

async function save() {
  const createdTransaction = await addTransaction(state.value as TablesInsert<'Transactions'>)

  if (createdTransaction) {
    state.value = createTransactionFormState()
  }
}
</script>

<template>
  <UForm :state="state" :schema="transactionSchema" @submit="save">
    <UFormField label="Transaction type" required name="type" class="mb-4">
      <USelect v-model="state.type" placeholder="Transaction type" :items="types" />
    </UFormField>

    <UFormField label="Amount" required name="amount" class="mb-4">
      <UInput v-model.number="state.amount" type="number" placeholder="Amount" />
    </UFormField>

    <UFormField label="Transaction date" required name="created_at" class="mb-4">
      <UInput v-model="state.created_at" type="date" placeholder="Transaction date" />
    </UFormField>

    <UFormField label="Description" name="description" class="mb-4">
      <UInput v-model="state.description" placeholder="Description" />
    </UFormField>

    <UFormField
      v-if="state.type === 'Expense'"
      label="Category"
      :required="state.type === 'Expense'"
      name="category"
      class="mb-4"
    >
      <USelect v-model="state.category" placeholder="Category" :items="categories" />
    </UFormField>

    <div class="flex justify-end">
      <UButton type="submit" :loading="isLoading" :disabled="isLoading">
        Save
      </UButton>
    </div>
  </UForm>
</template>
