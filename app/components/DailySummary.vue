<script setup lang="ts">
import { formatDate } from '~/utils/formatDateTime'

interface Props {
  amount: number
  date: string
}

const props = defineProps<Props>()

const formattedDate = computed(() => formatDate(props.date))

const { currency } = useCurrency(toRef(props, 'amount'))
</script>

<template>
  <div class="flex items-center justify-between py-3 border-b border-gray-300 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-200">
    <span>{{ formattedDate }}</span>
    <span>{{ currency }}</span>
  </div>
</template>
