import {
  endOfDay,
  endOfMonth,
  endOfYear,
  isWithinInterval,
  parseISO,
  subDays,
  subMonths,
  subYears,
  startOfDay,
  startOfMonth,
  startOfYear
} from 'date-fns'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { transactionViewOptions } from '~/constants'

type TimePeriod = typeof transactionViewOptions[number]

export const useSelectedTimePeriod = (period: MaybeRefOrGetter<TimePeriod>) => {
  const range = computed(() => {
    const now = new Date()
    const selectedPeriod = toValue(period)

    switch (selectedPeriod) {
      case 'Daily':
        return {
          start: startOfDay(now),
          end: endOfDay(now)
        }
      case 'Yearly':
        return {
          start: startOfYear(now),
          end: endOfYear(now)
        }
      case 'Monthly':
      default:
        return {
          start: startOfMonth(now),
          end: endOfMonth(now)
        }
    }
  })

  const previousRange = computed(() => {
    const now = new Date()
    const selectedPeriod = toValue(period)

    switch (selectedPeriod) {
      case 'Daily': {
        const previousDay = subDays(now, 1)
        return {
          start: startOfDay(previousDay),
          end: endOfDay(previousDay)
        }
      }
      case 'Yearly': {
        const previousYear = subYears(now, 1)
        return {
          start: startOfYear(previousYear),
          end: endOfYear(previousYear)
        }
      }
      case 'Monthly':
      default: {
        const previousMonth = subMonths(now, 1)
        return {
          start: startOfMonth(previousMonth),
          end: endOfMonth(previousMonth)
        }
      }
    }
  })

  function isInSelectedTimePeriod(value: Date | string) {
    const date = typeof value === 'string' ? parseISO(value) : value

    return isWithinInterval(date, {
      start: range.value.start,
      end: range.value.end
    })
  }

  function isInPreviousTimePeriod(value: Date | string) {
    const date = typeof value === 'string' ? parseISO(value) : value

    return isWithinInterval(date, {
      start: previousRange.value.start,
      end: previousRange.value.end
    })
  }

  return {
    range,
    previousRange,
    startDate: computed(() => range.value.start),
    endDate: computed(() => range.value.end),
    previousStartDate: computed(() => previousRange.value.start),
    previousEndDate: computed(() => previousRange.value.end),
    isInSelectedTimePeriod,
    isInPreviousTimePeriod
  }
}
