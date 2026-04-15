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

const {data: transactions, pending} = await useAsyncData('transactions', async () => {
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
      <Trend title="Income" :amount="1000" :lastAmount="900" color="green" />
      <Trend title="Expense" :amount="500" :lastAmount="600" color="red" />
      <Trend title="Investments" :amount="200" :lastAmount="150" color="green" />
      <Trend title="Savings" :amount="300" :lastAmount="300" color="green" :loading="true" />
    </section>
    <section>
      <div v-for="group in groupedTransactions" :key="group.date" class="mb-6">
        <DailySummary :date="group.date" :amount="group.amount" />
        <Transaction v-for="transaction in group.transactions" :key="transaction.id" :transaction="transaction" />
      </div>
    </section>
  </UContainer>
</template>
