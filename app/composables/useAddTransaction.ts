import type { Database, TablesInsert } from '~/types/database.types'

type SupabaseClient = ReturnType<typeof useSupabaseClient<Database>>

type UseAddTransactionOptions = {
  onSuccess?: () => void | Promise<void>
}

export async function addTransaction(
  supabase: SupabaseClient,
  transaction: TablesInsert<'Transactions'>
) {
  const { data, error } = await supabase
    .from('Transactions')
    .upsert(transaction)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export const useAddTransaction = (options: UseAddTransactionOptions = {}) => {
  const supabase = useSupabaseClient<Database>()
  const toast = useAppToast()
  const isLoading = ref(false)

  async function submitTransaction(transaction: TablesInsert<'Transactions'>) {
    if (isLoading.value) {
      return null
    }

    try {
      isLoading.value = true

      const createdTransaction = await addTransaction(supabase, transaction)

      toast.success('Transaction added!')

      await options.onSuccess?.()

      return createdTransaction
    } catch (error) {
      const description = error instanceof Error ? error.message : 'Could not add transaction.'

      toast.error({
        title: 'Could not add transaction',
        description
      })

      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    addTransaction: submitTransaction,
    isLoading
  }
}
