import { z } from 'zod'
import type { MaybeRefOrGetter } from 'vue'
import type { transactionViewOptions } from '~/constants'
import type { Database, Tables } from '~/types/database.types'

export type TransactionRow = Tables<'Transactions'>
export type TimePeriod = typeof transactionViewOptions[number]

export type TransactionGroup = {
  amount: number
  date: string
  transactions: TransactionRow[]
}

const baseSchema = z.object({
  amount: z.number('Amount must be a number').positive('Amount must be greater than 0'),
  created_at: z.string().min(1, 'Transaction date is required'),
  description: z.string().optional()
})

export const transactionSchema = z.intersection(
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

export type TransactionFormState = Partial<z.input<typeof transactionSchema>>

export const createTransactionFormState = (): TransactionFormState => ({
  type: undefined,
  amount: 0,
  created_at: '',
  description: '',
  category: ''
})

export const useTransactions = (period?: MaybeRefOrGetter<TimePeriod>) => {
  const supabase = useSupabaseClient<Database>()
  const selectedTimePeriod = period ? useSelectedTimePeriod(period) : null

  const { data: transactions, pending, refresh } = useAsyncData('transactions', async () => {
    const { data, error } = await supabase
      .from('Transactions')
      .select()
      .order('created_at', { ascending: false })

    if (error) return []

    return data
  })

  const filteredTransactions = computed(() => {
    const allTransactions = transactions.value ?? []

    if (!selectedTimePeriod) {
      return allTransactions
    }

    return allTransactions.filter(transaction =>
      selectedTimePeriod.isInSelectedTimePeriod(transaction.created_at)
    )
  })

  const previousPeriodTransactions = computed(() => {
    const allTransactions = transactions.value ?? []

    if (!selectedTimePeriod) {
      return []
    }

    return allTransactions.filter(transaction =>
      selectedTimePeriod.isInPreviousTimePeriod(transaction.created_at)
    )
  })

  const groupedTransactions = computed(() => {
    if (!transactions.value?.length) return []

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

  const incomes = computed(() =>
    filteredTransactions.value.filter(transaction => transaction.type === 'Income')
  )

  const expenses = computed(() =>
    filteredTransactions.value.filter(transaction => transaction.type === 'Expense')
  )

  const investments = computed(() =>
    filteredTransactions.value.filter(transaction => transaction.type === 'Investment')
  )

  const savings = computed(() =>
    filteredTransactions.value.filter(transaction => transaction.type === 'Saving')
  )

  const previousIncomes = computed(() =>
    previousPeriodTransactions.value.filter(transaction => transaction.type === 'Income')
  )

  const previousExpenses = computed(() =>
    previousPeriodTransactions.value.filter(transaction => transaction.type === 'Expense')
  )

  const previousInvestments = computed(() =>
    previousPeriodTransactions.value.filter(transaction => transaction.type === 'Investment')
  )

  const previousSavings = computed(() =>
    previousPeriodTransactions.value.filter(transaction => transaction.type === 'Saving')
  )

  const incomeTotal = computed(() =>
    incomes.value.reduce((sum, transaction) => sum + (transaction.amount ?? 0), 0)
  )

  const expenseTotal = computed(() =>
    expenses.value.reduce((sum, transaction) => sum + (transaction.amount ?? 0), 0)
  )

  const investmentTotal = computed(() =>
    investments.value.reduce((sum, transaction) => sum + (transaction.amount ?? 0), 0)
  )

  const savingTotal = computed(() =>
    savings.value.reduce((sum, transaction) => sum + (transaction.amount ?? 0), 0)
  )

  const previousIncomeTotal = computed(() =>
    previousIncomes.value.reduce((sum, transaction) => sum + (transaction.amount ?? 0), 0)
  )

  const previousExpenseTotal = computed(() =>
    previousExpenses.value.reduce((sum, transaction) => sum + (transaction.amount ?? 0), 0)
  )

  const previousInvestmentTotal = computed(() =>
    previousInvestments.value.reduce((sum, transaction) => sum + (transaction.amount ?? 0), 0)
  )

  const previousSavingTotal = computed(() =>
    previousSavings.value.reduce((sum, transaction) => sum + (transaction.amount ?? 0), 0)
  )

  return {
    transactions,
    filteredTransactions,
    previousPeriodTransactions,
    pending,
    refresh,
    groupedTransactions,
    incomes,
    expenses,
    investments,
    savings,
    previousIncomes,
    previousExpenses,
    previousInvestments,
    previousSavings,
    incomeTotal,
    expenseTotal,
    investmentTotal,
    savingTotal,
    previousIncomeTotal,
    previousExpenseTotal,
    previousInvestmentTotal,
    previousSavingTotal
  }
}
