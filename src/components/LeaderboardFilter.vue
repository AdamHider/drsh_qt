<template>
  <q-btn icon="tune" flat @click="dialog = true"></q-btn>
  <q-dialog v-model="dialog" position="top">
      <q-card>
        <q-card-section class="q-pb-sm">
          <div class="text-h6"><b>Фильтр</b></div>
        </q-card-section>
          <q-separator/>
        <q-card-section class="q-py-sm">
            <div >
              <div class="text-subtitle2"><b>Ресурсы</b></div>
              <div class="text-caption text-grey">По какому ресурсу показывать рейтинг</div>
            </div>
            <q-list >
              <q-item tag="label" class="q-pa-none" v-for="(option, optionKey) in formData.fields.resource.options" :key="optionKey" :name="option.value" dense>
                <q-item-section avatar>
                  <q-radio v-model="formData.fields.resource.value" :val="option.value"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    <b>{{ option.label }}</b>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
        </q-card-section>
        <q-separator/>
        <q-card-section class="q-py-sm">
          <div >
              <div class="text-subtitle2"><b>Период</b></div>
              <div class="text-caption text-grey">За какое время показывать рейтинг</div>
            </div>
            <q-list >
              <q-item tag="label" class="q-pa-none" v-for="(option, optionKey) in formData.fields.time_period.options" :key="optionKey" :name="option.value" dense>
                <q-item-section avatar>
                  <q-radio v-model="formData.fields.time_period.value" :val="option.value"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    <b>{{ option.label }}</b>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
        </q-card-section>
          <q-separator/>
        <q-card-section class="q-py-sm">
          <div >
              <div class="text-subtitle2"><b>Места</b></div>
              <div class="text-caption text-grey">Какой диапазон мест показывать</div>
            </div>
            <q-list >
              <q-item tag="label" class="q-pa-none" v-for="(option, optionKey) in formData.fields.place_range.options" :key="optionKey" :name="option.value" dense>
                <q-item-section avatar>
                  <q-radio v-model="formData.fields.place_range.value" :val="option.value"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    <b>{{ option.label }}</b>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
        </q-card-section>
          <q-separator/>
        <q-card-actions>
          <q-btn push class="full-width" color="primary" @click="dialog = false"><b>Сохранить</b></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

</template>

<script setup >
import { onActivated, onMounted, reactive, ref, watch } from 'vue'
import { playAudio } from 'src/services/audioService';
import { useUserStore } from '../stores/user'

const { user } = useUserStore()

const emits = defineEmits(['onChange'])

const form = ref(null)
const dialog = ref(false)

const formData = reactive({
  valid: true,
  fields: {
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
    },
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
    place_range: {
      value: 'all',
      options: [
        {
          label: 'Показывать всех',
          value: 'all'
        },
        {
          label: 'Топ-10',
          value: '10'
        },
        {
          label: 'Топ-30',
          value: '30'
        }
      ]
    }
  }
})

const prepareFilter = () => {
  const result = {};
  for(var i in formData.fields){
    result[i] = formData.fields[i].value
    if(i == 'place_range' &&  formData.fields[i].value !== 'all'){
      result.place_start = 4
      result.place_end = formData.fields[i].value
    } 
  }
  return result;
}

watch(formData.fields, async (currentValue, oldValue) => {
  emits('onChange', prepareFilter())
})
</script>
