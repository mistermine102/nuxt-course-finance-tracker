<script setup lang="ts">
import AddTransactionModal from '~/components/AddTransactionModal.vue';
import DailySummary from '~/components/DailySummary.vue';
import Trend from '~/components/Trend.vue';
import Transaction from '~/components/Transaction.vue';
import { transactionViewOptions } from '~/constants'

const selected = ref(transactionViewOptions[1]) // Default to Monthly

const {
  pending,
  refresh,
  groupedTransactions,
  incomeTotal,
  expenseTotal,
  investmentTotal,
  savingTotal,
  previousIncomeTotal,
  previousExpenseTotal,
  previousInvestmentTotal,
  previousSavingTotal
} = useTransactions(selected)

const isAddModalOpen = ref(false)

async function handleTransactionAdded() {
  await refresh()
}
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
      <Trend title="Income" :amount="incomeTotal" :lastAmount="previousIncomeTotal" color="green" :loading="pending" />
      <Trend title="Expense" :amount="expenseTotal" :lastAmount="previousExpenseTotal" color="red" :loading="pending" />
      <Trend title="Investments" :amount="investmentTotal" :lastAmount="previousInvestmentTotal" color="green" :loading="pending" />
      <Trend title="Savings" :amount="savingTotal" :lastAmount="previousSavingTotal" color="green" :loading="pending" />
    </section>
    <section>
      <div class="flex justify-end mb-4">
        <UButton
          color="primary"
          icon="i-heroicons-plus"
          label="Add"
          @click="isAddModalOpen = true"
        />
      </div>
      <AddTransactionModal v-model:open="isAddModalOpen" @transaction-added="handleTransactionAdded" />
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
