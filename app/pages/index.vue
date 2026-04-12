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
  </UContainer>
</template>

<script setup lang="ts">
import { transactionViewOptions } from '~/constants'

const selected = ref(transactionViewOptions[1]) // Default to Monthly
</script>
