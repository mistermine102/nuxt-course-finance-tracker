<script setup lang="ts">
const props = defineProps({
    title: String,
    amount: Number,
    lastAmount: Number,
    color: String,
    loading: Boolean
})

const trendPercentage = computed(() => {
  if (!props.amount || !props.lastAmount) return 0
  return Math.ceil(((props.amount - props.lastAmount) / props.lastAmount) * 100)
})

const icon = computed(() => trendPercentage.value >= 0 ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down')

const colorClass = computed(() => {
    if (trendPercentage.value >= 0) return 'text-green-600 dark:text-green-400'
    else return 'text-red-600 dark:text-red-400'
})
</script>

<template>
    <div>
        <div class="font-bold" :class="[colorClass]">{{ title }}</div>

        <div class="text-2xl font-extrabold text-black dark:text-white mb-2">
            <USkeleton class="h-8 w-full" v-if="loading"/>
            <div v-else>{{amount}}</div>
        </div>

        <div class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <USkeleton class="h-6 w-full" v-if="loading" />
            <template v-else>
                <UIcon :name="icon" class="w-4 h-4" :class="[colorClass]" />
                {{ Math.abs(trendPercentage) }}% from last period
            </template>
        </div>
    </div>
</template>
