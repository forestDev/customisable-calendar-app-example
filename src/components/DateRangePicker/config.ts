import type { Unit } from '@/components/DateRangePicker/types'

export const DURATION_UNITS: Record<string, Unit> = {
  YEAR: 'year',
  QUARTER: 'quarter',
  MONTH: 'month',
  WEEK: 'week',
  DAY: 'day',
  HOUR: 'hour',
  MINUTE: 'minute',
}
export const BOUNDARY_DATE_UNITS: Record<string, Unit> = {
  DATE_FROM: 'date-from',
  DATE_TO: 'date-to',
}

export const AVAILABLE_UNITS: Record<string, Unit> = {
  ...DURATION_UNITS,
  ...BOUNDARY_DATE_UNITS,
  DATE_FROM_TO: 'date-from-to',
}
