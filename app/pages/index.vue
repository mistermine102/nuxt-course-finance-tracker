<script setup lang="ts">
import DailySummary from '~/components/DailySummary.vue';
import Trend from '~/components/Trend.vue';
import Transaction from '~/components/Transaction.vue';
import type { Database, Tables } from '~/types/database.types'
import { transactionViewOptions } from '~/constants'

type TransactionRow = Tables<'Transactions'>
type TransactionGroup = {
  amount: number
  date: string
  transactions: TransactionRow[]
}

const supabase = useSupabaseClient<Database>()

const { data: transactions, pending, refresh } = await useAsyncData('transactions', async () => {
  const { data, error } = await supabase
    .from('Transactions')
    .select()

    if(error) return []

    return data
})

const groupedTransactions = computed(() => {
  if (!transactions.value) return []

  const grouped = transactions.value.reduce<Record<string, TransactionRow[]>>((acc, transaction) => {
    const key = transaction.created_at.slice(0, 10)

    acc[key] ??= []
    acc[key].push(transaction)

    return acc
  }, {})

  return Object.entries(grouped).map(([date, transactions]) => ({
    date,
    amount: transactions.reduce((sum, transaction) => {
      const amount = transaction.amount ?? 0
      return transaction.type === 'Income' ? sum + amount : sum - amount
    }, 0),
    transactions
  })) satisfies TransactionGroup[]
})

const incomes = computed(() => {
  return (transactions.value ?? []).filter(transaction => transaction.type === 'Income')
})

const expenses = computed(() => {
  return (transactions.value ?? []).filter(transaction => transaction.type === 'Expense')
})

const incomeTotal = computed(() => {
  return incomes.value.reduce((sum, transaction) => {
    return sum + (transaction.amount ?? 0)
  }, 0)
})

const expenseTotal = computed(() => {
  return expenses.value.reduce((sum, transaction) => {
    return sum + (transaction.amount ?? 0)
  }, 0)
})

const selected = ref(transactionViewOptions[1]) // Default to Monthly

</script>

<template>


  <UContainer class="py-10">
    <section class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-4xl font-extrabold tracking-tight">Summary</h1>
      </div>
      <div>
        <USelectMenu v-model="selected" :items="transactionViewOptions" class="w-32" />
      </div>
    </section>
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-8">
      <Trend title="Income" :amount="incomeTotal" :lastAmount="0" color="green" :loading="pending" />
      <Trend title="Expense" :amount="expenseTotal" :lastAmount="0" color="red" :loading="pending" />
      <Trend title="Investments" :amount="200" :lastAmount="150" color="green" :loading="pending" />
      <Trend title="Savings" :amount="300" :lastAmount="300" color="green" :loading="pending" />
    </section>
    <section>
      <div class="flex justify-end mb-4">
        <UButton color="primary" icon="i-heroicons-plus" label="Add" />
      </div>
      <div v-if="pending" class="space-y-6">
        <div v-for="index in 3" :key="index" class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <USkeleton class="h-5 w-28" />
            <USkeleton class="h-5 w-20" />
          </div>
          <div class="space-y-4">
            <div
              v-for="rowIndex in 3"
              :key="`${index}-${rowIndex}`"
              class="grid grid-cols-1 sm:grid-cols-3 py-4 border-b border-gray-200 dark:border-gray-800 items-center gap-4 sm:gap-0"
            >
              <div class="flex items-center space-x-3">
                <USkeleton class="h-5 w-5 rounded-full" />
                <div class="space-y-2 min-w-0">
                  <USkeleton class="h-4 w-40" />
                  <USkeleton class="h-3 w-24" />
                </div>
                <USkeleton class="h-5 w-20" />
              </div>
              <div class="flex items-center sm:justify-center">
                <USkeleton class="h-4 w-24" />
              </div>
              <div class="flex items-center sm:justify-end">
                <USkeleton class="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else v-for="group in groupedTransactions" :key="group.date" class="mb-6">
        <DailySummary :date="group.date" :amount="group.amount" />
        <Transaction
          v-for="transaction in group.transactions"
          :key="transaction.id"
          :transaction="transaction"
          @deleted="refresh()"
        />
      </div>
    </section>
  </UContainer>
</template>
