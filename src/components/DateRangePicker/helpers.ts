import type { Unit } from '@/components/DateRangePicker/types'

export const getVerboseUnit = (unit: Unit) => {
  return unit.toUpperCase().split('-').join(' ')
}
