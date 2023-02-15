<template>
    <q-form
      ref="form"
      v-model="formData.valid"
      autocomplete="off"
      class="full-width">
          <div v-if="props.filterClassroomEnabled">
            <q-checkbox v-model="formData.fields.by_classroom.value" label="Classroom only" />
          </div>
          <div class="q-pa-sm" v-if="props.filterDateEnabled">
            <q-option-group
              v-model="formData.fields.time_period.value"
              :options="formData.fields.time_period.options"
              color="primary"
              inline
              dense
            />
          </div>
    </q-form>
</template>

<script setup >
import { useLeaderboard } from '../composables/useLeaderboard.js'
import { reactive, ref, watch } from 'vue'

const { leaderboard } = useLeaderboard()

const form = ref(null)

const props = defineProps({
  filterEnabled: Boolean,
  filterClassroomEnabled: Boolean,
  filterDateEnabled: Boolean
})

const formData = reactive({
  valid: true,
  fields: {
    by_classroom: {
      value: false
    },
    time_period: {
      value: 'week',
      options: [
        {
          label: 'Week',
          value: 'week'
        },
        {
          label: 'Month',
          value: 'month'
        },
        {
          label: 'All time',
          value: 'all'
        }
      ]
    }
  }
})
watch(formData.fields, async (currentValue, oldValue) => {
  for (const i in formData.fields) {
    leaderboard.filter[i] = formData.fields[i].value
  }
})
</script>
