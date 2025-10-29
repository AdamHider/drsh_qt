<template>
    <q-form
      ref="form"
      v-model="formData.valid"
      autocomplete="off"
      class="full-width">
          <div v-if="props.allowedFilters.includes('time_period')">
            <q-chip v-for="(option, optionKey) in formData.fields.time_period.options" :key="optionKey"
              clickable
              class="q-push"
              :color="(formData.fields.time_period.value == option.value) ? 'primary' : ''"
              :text-color="(formData.fields.time_period.value == option.value) ? 'white' : ''"
              @click="formData.fields.time_period.value = option.value"  @click.stop="playAudio('click')">
              <b>{{ option.label }}</b>
            </q-chip>
          </div>
          <div v-if="props.allowedFilters.includes('resource') && user.active?.data?.resources" class="flex justify-center">
            <q-tabs
              v-model="formData.fields.resource.value"
              :indicator-color="user.active?.data?.resources[formData.fields.resource.value]?.color"
              switch-indicator
              dense
            >
              <q-tab v-for="(option, optionKey) in formData.fields.resource.options" :key="optionKey" :name="option.value">
                <q-item :class="`${(formData.fields.resource.value == option.value) ? `text-${user.active?.data?.resources[option.value]?.color}` : ''}`">
                  <q-item-section avatar>
                    <q-avatar size="30px">
                      <q-img :src="user.active.data?.resources[option.value].image" style="filter: drop-shadow(rgba(0, 0, 0, 0.44) 0px 2px 2px);"/>
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <div class="text-caption"><b>{{ option.label }}</b></div>
                  </q-item-section>
                </q-item>
              </q-tab>

            </q-tabs>
          </div>
    </q-form>
</template>

<script setup >
import { onActivated, onMounted, reactive, ref, watch } from 'vue'
import { playAudio } from 'src/services/audioService';
import { useUserStore } from '../stores/user'

const { user } = useUserStore()

const emits = defineEmits(['update-filter'])

const form = ref(null)

const props = defineProps({
  allowedFilters: Array,
  timePeriod: String
})
const formData = reactive({
  valid: true,
  fields: {
    time_period: {
      value: 'all',
      options: [
        {
          label: 'Всё время',
          value: 'all'
        },
        {
          label: 'Месяц',
          value: 'month'
        },
        {
          label: 'Неделя',
          value: 'week'
        }
      ]
    },
    resource: {
      value: 'star',
      options: [
        {
          label: 'Звёзды',
          value: 'star'
        },
        {
          label: 'Опыт',
          value: 'experience'
        }
      ]
    }
  }
})
onMounted(() => {
  if (props.timePeriod) formData.fields.time_period.value = props.timePeriod
  if (props.timePeriod) formData.fields.time_period.value = props.timePeriod
})
onActivated(() => {
  if (props.timePeriod) formData.fields.time_period.value = props.timePeriod
  if (props.timePeriod) formData.fields.time_period.value = props.timePeriod
})
const composeFilter = () => {
  const filter = {}
  for (const i in formData.fields) {
    if (props.allowedFilters.includes(i)) filter[i] = formData.fields[i].value
  }
  return filter
}
watch(formData.fields, async (currentValue, oldValue) => {
  if (props.timePeriod) {
    formData.fields.time_period.value = props.timePeriod
    return
  }
  emits('update-filter', composeFilter())
})
</script>
