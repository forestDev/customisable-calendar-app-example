<script setup lang="ts">
import type { Model as DateRAngePickerModel, Unit } from '@/components/DateRangePicker/types'
import DateRangePicker from '@/components/DateRangePicker/DateRangePicker.vue'
import { ref, watch } from 'vue'
import { AVAILABLE_UNITS } from './components/DateRangePicker/config.ts'
import { getVerboseUnit } from './components/DateRangePicker/helpers.ts'

const value = ref<DateRAngePickerModel | null>(null)
const minDate = ref<string | undefined>()
const maxDate = ref<string | undefined>()
const availableUnits = ref<Unit[]>(Object.values(AVAILABLE_UNITS))
const maxDuration = ref<number | undefined>()
const minDuration = ref<number | undefined>()

watch([minDate, maxDate, availableUnits], () => {
  value.value = null
})
</script>

<template>
  <div>
    <DateRangePicker
      v-model="value"
      :min-date="minDate"
      :max-date="maxDate"
      :units-options="availableUnits"
      :max-duration="maxDuration"
      :min-duration="minDuration"
    />

    <div class="model-value">
      <h4>ModelValue:</h4>
      <pre>{{ JSON.stringify(value, null, 2) }}</pre>
    </div>

    <div class="configuration">
      <h4>Configuration</h4>
      <div>
        <label for="min-date"> Min duration: </label>
        <input type="number" id="min-date" v-model="minDuration" v-integers-only />
        <button v-if="minDate" @click="minDate = undefined">clear</button>
      </div>
      <div>
        <label for="min-date"> Max duration: </label>
        <input type="number" id="min-date" v-model="maxDuration" v-integers-only />
        <button v-if="minDate" @click="minDate = undefined">clear</button>
      </div>
      <div>
        <label for="min-date"> Min date: </label>
        <input type="date" id="min-date" v-model="minDate" />
        <button v-if="minDate" @click="minDate = undefined">clear</button>
      </div>

      <div>
        <label for="max-date"> Max date: </label>
        <input type="date" id="max-date" v-model="maxDate" />
        <button v-if="maxDate" @click="maxDate = undefined">clear</button>
      </div>

      <div>
        <p>Available units:</p>
        <div v-for="(unit, key) in Object.values(AVAILABLE_UNITS)" :key="`unit_${key}`">
          <label :for="unit">{{ getVerboseUnit(unit) }}</label>
          <input type="checkbox" :value="unit" :id="unit" v-model="availableUnits" />
        </div>
      </div>

      <div>
        <h4>Configuration output</h4>
        <pre>{{
          JSON.stringify(
            {
              minDuration,
              maxDuration,
              minDate,
              maxDate,
              availableUnits,
            },
            null,
            4,
          )
        }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.configuration {
  & > * {
    margin-bottom: 16px;
  }
}

.model-value {
  margin-top: 64px;
}
</style>
