export type Unit =
  | 'year'
  | 'quarter'
  | 'month'
  | 'week'
  | 'day'
  | 'hour'
  | 'minute'
  | 'date-from-to'
  | 'date-from'
  | 'date-to'

export interface Model {
  unit: Unit | null
  dateTo?: string | null
  dateFrom?: string | null
  duration?: number | null
}
