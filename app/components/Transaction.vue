<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Tables } from '~/types/database.types'
import { formatTime } from '~/utils/formatDateTime'

interface Props {
  transaction: Tables<'Transactions'>
}

const props = defineProps<Props>()

const isIncome = computed(() => props.transaction.type === 'Income')
const icon = computed(() => isIncome.value ? 'i-heroicons-arrow-up-right' : 'i-heroicons-arrow-down-left')
const iconColor = computed(() => isIncome.value ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400')

const amount = computed(() => props.transaction.amount)
const formattedTime = computed(() => formatTime(props.transaction.created_at))

const { currency } = useCurrency(amount)

const items: DropdownMenuItem[][] = [
  [
    {
      label: 'Edit',
      icon: 'i-heroicons-pencil-square-20-solid',
      onSelect: () => console.log('Edit')
    },
    {
      label: 'Delete',
      icon: 'i-heroicons-trash-20-solid',
      onSelect: () => console.log('Delete')
    }
  ]
]
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 items-center gap-4 sm:gap-0">
    
    <!-- Left: Desc and Category -->
    <div class="flex items-center space-x-3">
      <UIcon :name="icon" :class="[iconColor]" class="w-5 h-5 flex-shrink-0" />
      <div class="min-w-0">
        <div class="truncate">{{ transaction.description }}</div>
        <div class="text-xs text-gray-500 dark:text-gray-400">{{ formattedTime }}</div>
      </div>
      <UBadge color="neutral">{{ transaction.category }}</UBadge>
    </div>

    <!-- Middle: Amount -->
    <div class="flex items-center sm:justify-center font-medium">
      {{ currency }}
    </div>

    <!-- Right: Options -->
    <div class="flex items-center sm:justify-end">
      <UDropdownMenu :items="items" :content="{ align: 'end' }">
        <UButton color="neutral" variant="ghost" trailing-icon="i-heroicons-ellipsis-horizontal" :loading="false" />
      </UDropdownMenu>
    </div>
    
  </div>
</template>
