<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Database, Tables } from '~/types/database.types'
import { formatTime } from '~/utils/formatDateTime'

interface Props {
  transaction: Tables<'Transactions'>
}

const props = defineProps<Props>()
const emit = defineEmits<{
  deleted: []
}>()
const supabase = useSupabaseClient<Database>()
const toast = useAppToast()
const loading = ref(false)

const isIncome = computed(() => props.transaction.type === 'Income')
const icon = computed(() => isIncome.value ? 'i-heroicons-arrow-up-right' : 'i-heroicons-arrow-down-left')
const iconColor = computed(() => isIncome.value ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400')

const amount = computed(() => props.transaction.amount)
const formattedTime = computed(() => formatTime(props.transaction.created_at))

const { currency } = useCurrency(amount)

const deleteTransaction = async () => {
  if (loading.value) return

  loading.value = true

  const { error } = await supabase
    .from('Transactions')
    .delete()
    .eq('id', props.transaction.id)

  loading.value = false

  if (error) {
    toast.error({
      title: 'Could not delete transaction',
      description: error.message
    })
    return
  }

  toast.success({
    title: 'Transaction deleted',
    description: props.transaction.description ?? 'The selected transaction was removed.'
  })

  emit('deleted')
}

const items = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: 'Edit',
      icon: 'i-heroicons-pencil-square-20-solid',
      onSelect: () => console.log('Edit')
    },
    {
      label: 'Delete',
      icon: 'i-heroicons-trash-20-solid',
      disabled: loading.value,
      onSelect: deleteTransaction
    }
  ]
])
</script>

<template>
  <div class="grid grid-cols-1 gap-4 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center sm:gap-6">
    <div class="grid min-w-0 items-start gap-3 sm:grid-cols-[auto_minmax(0,1fr)]">
      <UIcon :name="icon" :class="[iconColor]" class="w-5 h-5 flex-shrink-0" />
      <div class="grid min-w-0 gap-1">
        <div class="flex min-w-0 flex-wrap items-start gap-2">
          <div class="min-w-0 flex-1 whitespace-normal break-words leading-5">{{ transaction.description }}</div>
          <UBadge v-if="transaction.category" color="neutral">{{ transaction.category }}</UBadge>
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400">{{ formattedTime }}</div>
      </div>
    </div>

    <div class="font-medium sm:justify-self-end sm:text-right">
      {{ currency }}
    </div>

    <div class="flex items-center sm:justify-self-end">
      <UDropdownMenu :items="items" :content="{ align: 'end' }">
        <UButton color="neutral" variant="ghost" trailing-icon="i-heroicons-ellipsis-horizontal" :loading="loading" :disabled="loading" />
      </UDropdownMenu>
    </div>
  </div>
</template>
