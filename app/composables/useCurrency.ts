export const useCurrency = (amount: Ref<number | undefined> | number | undefined) => {
    const currency = computed(() => {
        const val = isRef(amount) ? amount.value : amount
        if (val === undefined || val === null) return null
        return new Intl.NumberFormat('pl-PL', {
            style: 'currency',
            currency: 'PLN',
        }).format(val)
    })

    return { currency }
}