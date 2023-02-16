<template>
    <q-form
      ref="form"
      v-model="formData.valid"
      autocomplete="off"
      class="full-width">
          <div v-if="props.allowedFilters.includes('by_classroom')">
            <q-checkbox v-model="formData.fields.by_classroom.value" label="Classroom only" />
          </div>
          <div v-if="props.allowedFilters.includes('time_period')">
            <q-chip v-for="(option, optionKey) in formData.fields.time_period.options" :key="optionKey"
              clickable
              :color="(formData.fields.time_period.value == option.value) ? 'primary' : ''"
              :text-color="(formData.fields.time_period.value == option.value) ? 'white' : ''"
              @click="formData.fields.time_period.value = option.value">
              <b>{{ option.label }}</b>
            </q-chip>
          </div>
    </q-form>
</template>

<script setup >
import { onActivated, onMounted, reactive, ref, watch } from 'vue'

const emits = defineEmits(['update-filter'])

const form = ref(null)

const props = defineProps({
  allowedFilters: Array,
  byClassroom: Boolean,
  timePeriod: String
})
const formData = reactive({
  valid: true,
  fields: {
    by_classroom: {
      value: false
    },
    time_period: {
      value: 'all',
      options: [
        {
          label: 'All time',
          value: 'all'
        },
        {
          label: 'Month',
          value: 'month'
        },
        {
          label: 'Week',
          value: 'week'
        }
      ]
    }
  }
})
onMounted(() => {
  if (props.byClassroom) formData.fields.by_classroom.value = props.byClassroom
  if (props.timePeriod) formData.fields.time_period.value = props.timePeriod
})
onActivated(() => {
  if (props.byClassroom) formData.fields.by_classroom.value = props.byClassroom
  if (props.timePeriod) formData.fields.time_period.value = props.timePeriod
})
const composeFilter = () => {
  const filter = {}
  for (const i in formData.fields) {
    if (props.allowedFilters.includes(i)) filter[i] = formData.fields[i].value
  }
  return filter
}
watch(() => formData.fields.by_classroom.value, async (currentValue, oldValue) => {
  if (props.byClassroom) {
    formData.fields.by_classroom.value = props.byClassroom
    return
  }
  emits('update-filter', composeFilter())
})
watch(() => formData.fields.time_period.value, async (currentValue, oldValue) => {
  if (props.timePeriod) {
    formData.fields.time_period.value = props.timePeriod
    return
  }
  emits('update-filter', composeFilter())
})
</script>
