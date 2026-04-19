<script setup lang="ts">
import { categories, types } from '~/constants'
import { z } from 'zod'

const baseSchema = z.object({
  amount: z.number('Amount must be a number').positive('Amount must be greater than 0'),
  created_at: z.string().min(1, 'Transaction date is required'),
  description: z.string().optional()
})

const schema = z.intersection(
  baseSchema,
  z.discriminatedUnion('type', [
    z.object({
      type: z.literal('Expense'),
      category: z.string().min(1, 'Category is required for expenses')
    }),
    z.object({
      type: z.enum(['Income', 'Saving', 'Investment']),
      category: z.string().optional()
    })
  ], 'Transaction type is required')
)

type TransactionFormState = Partial<z.input<typeof schema>>

const state = ref<TransactionFormState>({
  type: undefined,
  amount: 0,
  created_at: '',
  description: '',
  category: ''
})

function save() {
  console.log('SAVE FUNCTION RUNNING')
}
</script>

<template>
  <UForm :state="state" :schema="schema" @submit="save">
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
      <UButton type="submit">
        Save
      </UButton>
    </div>
  </UForm>
</template>
