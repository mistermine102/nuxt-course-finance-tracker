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
  </UContainer>
</template>

<script setup lang="ts">
import Trend from '~/components/Trend.vue';
import { transactionViewOptions } from '~/constants'

const selected = ref(transactionViewOptions[1]) // Default to Monthly
</script>
