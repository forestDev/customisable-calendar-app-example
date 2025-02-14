import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import DateRangePicker from '@/components/DateRangePicker/DateRangePicker.vue'
import type { Unit } from '@/components/DateRangePicker/types'
import integersOnly from '@/directives/integers-only.ts'
import {
  AVAILABLE_UNITS,
  DURATION_UNITS,
  BOUNDARY_DATE_UNITS,
} from '@/components/DateRangePicker/config.ts'

type DateRangePickerProps = InstanceType<typeof DateRangePicker>['$props']

const findUnitSelect = (wrapper: VueWrapper) => {
  return wrapper.find('#unit')
}
const findAllUnitSelectOptions = (wrapper: VueWrapper) => {
  return findUnitSelect(wrapper).findAll('option')
}
const findDurationInput = (wrapper: VueWrapper) => {
  return wrapper.find('#duration')
}
const findDateFromInput = (wrapper: VueWrapper) => {
  return wrapper.find('#date-from')
}
const findDateToInput = (wrapper: VueWrapper) => {
  return wrapper.find('#date-to')
}
const createWrapper = (props?: DateRangePickerProps) =>
  mount(DateRangePicker, {
    props,
    directives: {
      'integers-only': integersOnly,
    },
  })

describe('DateRangePicker', () => {
  it('Should render select with units provided by props', () => {
    const availableUnits: Unit[] = ['date-to', 'date-from']

    const wrapper = createWrapper({ unitsOptions: availableUnits })

    const unitSelect = findUnitSelect(wrapper)

    expect(unitSelect.exists()).toBe(true)

    const options = findAllUnitSelectOptions(wrapper)

    expect(options.length).toBe(availableUnits.length)

    options.forEach((option) => {
      expect((availableUnits as string[]).includes(option.element.value)).toBe(true)
    })
  })

  it('Should render only unit select input if modelValue is empty', async () => {
    const wrapper = createWrapper()

    const unitSelectInput = findUnitSelect(wrapper)
    const durationInput = findDurationInput(wrapper)
    const dateFromInput = findDateFromInput(wrapper)
    const dateToInput = findDateToInput(wrapper)

    expect(unitSelectInput.exists()).toBe(true)
    expect(durationInput.exists()).toBe(false)
    expect(dateFromInput.exists()).toBe(false)
    expect(dateToInput.exists()).toBe(false)
  })

  Object.values(DURATION_UNITS).forEach((unit) => {
    it(`Should render duration input if "${unit}" unit is selected`, async () => {
      const wrapper = createWrapper()

      const unitSelectInput = findUnitSelect(wrapper)

      await unitSelectInput.setValue(unit)

      const unitSelect = findUnitSelect(wrapper)
      const duration = findDurationInput(wrapper)
      const dateFrom = findDateFromInput(wrapper)
      const dateTo = findDateToInput(wrapper)

      expect(unitSelect.exists()).toBe(true)
      expect(duration.exists()).toBe(true)
      expect(dateFrom.exists()).toBe(false)
      expect(dateTo.exists()).toBe(false)
    })
  })

  Object.values(BOUNDARY_DATE_UNITS).forEach((unit) => {
    it(`Should render "${unit}" input if "${unit}" unit is selected`, async () => {
      const wrapper = createWrapper()

      const unitSelectInput = findUnitSelect(wrapper)

      await unitSelectInput.setValue(unit)

      const unitSelect = findUnitSelect(wrapper)
      const duration = findDurationInput(wrapper)
      const dateFrom = findDateFromInput(wrapper)
      const dateTo = findDateToInput(wrapper)

      expect(unitSelect.exists()).toBe(true)
      expect(duration.exists()).toBe(false)
      expect(dateFrom.exists()).toBe(unit === 'date-from')
      expect(dateTo.exists()).toBe(unit === 'date-to')
    })
  })

  it('Should emit update:modelValue with correct payload if provided modelValue is null', () => {
    const wrapper = createWrapper({
      modelValue: null,
    })

    expect(wrapper.emitted()['update:modelValue'][0]).toEqual([
      {
        unit: null,
      },
    ])
  })

  it('Should update modelValue after some input changes', async () => {
    let value = null

    const wrapper = createWrapper({
      modelValue: value,
      'onUpdate:modelValue': (event) => {
        value = event
      },
    })

    expect(value).toEqual({
      unit: null,
    })

    const unitSelect = findUnitSelect(wrapper)

    await unitSelect.setValue(AVAILABLE_UNITS.MONTH)

    expect(value).toEqual({
      duration: null,
      unit: AVAILABLE_UNITS.MONTH,
    })

    await unitSelect.setValue(AVAILABLE_UNITS.DATE_FROM)

    expect(value).toEqual({
      dateFrom: null,
      unit: AVAILABLE_UNITS.DATE_FROM,
    })

    const dateFromInput = findDateFromInput(wrapper)
    const dateFrom = '2025-02-14'

    await dateFromInput.setValue(dateFrom)

    expect(value).toEqual({
      dateFrom,
      unit: AVAILABLE_UNITS.DATE_FROM,
    })

    await unitSelect.setValue(AVAILABLE_UNITS.DATE_FROM_TO)

    expect(value).toEqual({
      dateFrom,
      dateTo: null,
      unit: AVAILABLE_UNITS.DATE_FROM_TO,
    })

    const dateToInput = findDateToInput(wrapper)

    const dateTo = '2025-02-16'

    await dateToInput.setValue(dateTo)

    expect(value).toEqual({
      dateFrom,
      dateTo: dateTo,
      unit: AVAILABLE_UNITS.DATE_FROM_TO,
    })
  })

  it('Should override incorrect provided duration (min/max duration is provided)', async () => {
    let value = null

    const minDuration = 1
    const maxDuration = 10
    const wrapper = createWrapper({
      minDuration,
      maxDuration,
      modelValue: value,
      'onUpdate:modelValue': (event) => {
        value = event
      },
    })

    const unitSelect = findUnitSelect(wrapper)

    await unitSelect.setValue(AVAILABLE_UNITS.YEAR)

    const durationInput = findDurationInput(wrapper)

    await durationInput.setValue(minDuration - 1)

    await durationInput.trigger('blur')

    expect(value).toEqual({
      unit: AVAILABLE_UNITS.YEAR,
      duration: minDuration,
    })

    await durationInput.setValue(maxDuration + 1)

    await durationInput.trigger('blur')

    expect(value).toEqual({
      unit: AVAILABLE_UNITS.YEAR,
      duration: maxDuration,
    })
  })
})
