<script lang="ts" setup>
import type { Model, Unit } from './types'
import { AVAILABLE_UNITS, DURATION_UNITS } from './config'
import { ref, computed, watch } from 'vue'
import { getVerboseUnit } from './helpers.ts'
import { isEqual } from '@/helpers/object.ts'

const props = withDefaults(
  defineProps<{
    modelValue?: Model | null
    unitsOptions?: Unit[]
    minDuration?: number
    maxDuration?: number
    minDate?: string
    maxDate?: string
  }>(),
  {
    unitsOptions: () => Object.values(AVAILABLE_UNITS),
  },
)
const emit = defineEmits<{
  'update:modelValue': [modelValue: Model]
}>()

const draftModel = ref<Model>({
  unit: null,
})

const showDurationInput = computed(() => {
  if (!draftModel.value.unit) {
    return false
  }

  return Object.values(DURATION_UNITS).includes(draftModel.value.unit)
})

const showDateFrom = computed(() => {
  if (!draftModel.value.unit) {
    return false
  }

  const { DATE_FROM, DATE_FROM_TO } = AVAILABLE_UNITS

  return [DATE_FROM, DATE_FROM_TO].includes(draftModel.value.unit)
})

const showDateTo = computed(() => {
  if (!draftModel.value.unit) {
    return false
  }
  const { DATE_TO, DATE_FROM_TO } = AVAILABLE_UNITS

  return [DATE_TO, DATE_FROM_TO].includes(draftModel.value.unit)
})

const minDateTo = computed(() => {
  const { dateFrom } = draftModel.value

  if (!showDateFrom.value) {
    return props.minDate
  }

  return dateFrom ? dateFrom : props.minDate
})

const maxDateFrom = computed(() => {
  const { dateTo } = draftModel.value

  if (!showDateTo.value) {
    return props.maxDate
  }

  return dateTo ? dateTo : props.maxDate
})

const validateDuration = () => {
  const { duration } = draftModel.value

  if (typeof duration !== 'number') {
    draftModel.value.duration = props.minDuration || 0

    return
  }

  if (props.minDuration !== undefined) {
    if (duration < props.minDuration) {
      draftModel.value.duration = props.minDuration

      return
    }
  }

  if (props.maxDuration !== undefined) {
    if (duration > props.maxDuration) {
      draftModel.value.duration = props.maxDuration

      return
    }
  }
}

watch(
  draftModel,
  () => {
    if (!!props.modelValue && isEqual(draftModel.value, props.modelValue)) {
      return
    }

    emit('update:modelValue', draftModel.value)
  },
  {
    deep: true,
    flush: 'post',
  },
)

watch(
  () => props.modelValue,
  () => {
    if (!!props.modelValue && isEqual(draftModel.value, props.modelValue)) {
      return
    }

    draftModel.value = {
      unit: null,
      ...props.modelValue,
    }
  },
  { immediate: true },
)

watch(showDurationInput, (show) => {
  if (!show) {
    delete draftModel.value.duration

    return
  }

  draftModel.value.duration = null
})

watch(showDateFrom, (show) => {
  if (!show) {
    delete draftModel.value.dateFrom

    return
  }

  draftModel.value.dateFrom = null
})

watch(showDateTo, (show) => {
  if (!show) {
    delete draftModel.value.dateTo

    return
  }

  draftModel.value.dateTo = null
})
</script>

<template>
  <div class="picker">
    <div class="field">
      <label for="unit">Unit</label>
      <select v-model="draftModel.unit" id="unit">
        <option v-for="option in unitsOptions" :key="option" :value="option">
          {{ getVerboseUnit(option) }}
        </option>
      </select>
    </div>

    <div class="field" v-if="showDurationInput">
      <label for="duration">Duration</label>
      <input
        v-model.lazy="draftModel.duration"
        id="duration"
        v-integers-only
        :min="minDuration"
        :max="maxDuration"
        type="number"
        @blur="validateDuration"
      />
    </div>

    <div class="field" v-if="showDateFrom">
      <label for="date-from">Date from</label>
      <input
        id="date-from"
        v-model="draftModel.dateFrom"
        :max="maxDateFrom"
        :min="minDate"
        @keydown="($event) => $event.preventDefault()"
        type="date"
      />
    </div>

    <div class="field" v-if="showDateTo">
      <label for="date-to">Date to</label>
      <input
        id="date-to"
        v-model="draftModel.dateTo"
        :max="maxDate"
        :min="minDateTo"
        @keydown="($event) => $event.preventDefault()"
        type="date"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.picker {
  display: flex;
  gap: 16px;

  .field {
    display: flex;
    flex-direction: column;
  }
}
</style>
