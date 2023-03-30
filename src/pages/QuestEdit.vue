<template>
  <q-page-wrapper>
    <q-app-header class="bg-white rounded-b-md bordered" reveal>
        <q-btn flat icon="arrow_back"  @click="$router.go(-1);" v:slot="back-button"/>
        <q-toolbar-title>Classroom Edit</q-toolbar-title>
        <q-btn flat icon="check" @click="saveChanges()"/>
    </q-app-header>
    <q-page class="bg-white q-pa-sm" style="padding-top: 50px">
        <q-form
          ref="form"
          v-model="formData.valid"
          @submit.prevent="validate()"
          autocomplete="off"
          class="full-width"
        >
            <div class="text-bold q-my-md">Description</div>
            <q-select
              outlined
              required
              v-model="formData.fields.code.value"
              :error-message="formData.fields.code.errors"
              :error="formData.fields.code.errors !== ''"
              emit-value
              map-options
              :options="formData.fields.code.options"
              label="Code"
              class="q-pt-sm q-pb-md"
            />
            <q-select
              v-if="formData.fields.code.value == 'lesson'"
              outlined
              v-model="formData.fields.lesson_id.value"
              :error-message="formData.fields.lesson_id.errors"
              :error="formData.fields.lesson_id.errors !== ''"
              clearable
              use-input
              emit-value
              map-options
              option-value="id"
              option-label="title"
              label="Select lesson"
              class="q-pt-sm q-pb-md"
              :options="formData.fields.lesson_id.options"
              @filter="loadLessonList"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-img :src="scope.opt.image" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.title }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-input
              outlined
              type="number"
              v-model="formData.fields.value.value"
              :rules="formData.fields.value.rules"
              :error-message="formData.fields.value.errors"
              :error="formData.fields.value.errors !== ''"
              label="Goal value"
              required
              class="q-pt-sm q-pb-md"
            />
            <q-toggle
              v-model="dateRangeStatus"
              label="Set dates"
            />
            <q-date
              v-if="dateRangeStatus"
              v-model="dateRange"
              class="full-width"
              bordered
              flat
              range />
            <div class="text-bold q-my-md">Status</div>
            <q-toggle
              name="is_disabled"
              v-model="formData.fields.is_disabled.value"
              label="Is disabled"
            />
        </q-form>
    </q-page>
  </q-page-wrapper>
</template>

<script setup >
import { api } from '../services/index'
import { reactive, ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const form = ref(null)
const quest = ref({})
const dateRangeStatus = ref(false)
const dateRange = ref({})
const route = useRoute()
const router = useRouter()

const formData = reactive({
  valid: true,
  fields: {
    lesson_id: {
      value: 0,
      options: []
    },
    code: {
      value: '',
      rules: [
        v => !!v || 'Code is required'
      ],
      errors: '',
      options: [
        {
          label: 'Total points',
          value: 'total_points'
        },
        {
          label: 'Total points first',
          value: 'total_points_first'
        },
        {
          label: 'Total lessons',
          value: 'total_lessons'
        },
        {
          label: 'Lesson',
          value: 'lesson'
        }
      ]
    },
    value: {
      value: 0,
      rules: [
        v => v !== false || 'Value is required',
        v => (/[0-9]*/.test(v)) || 'Value must be numeric'
      ],
      errors: ''
    },
    date_start: {
      value: null,
      rules: [
        v => v === '' || (v !== '') || 'Date start must be valid'
      ],
      errors: ''
    },
    date_end: {
      value: null,
      rules: [
        v => v === '' || (v !== '') || 'Date end must be valid'
      ],
      errors: ''
    },
    is_disabled: {
      value: false,
      errors: ''
    }
  }
})

const saveChanges = async function () {
  formData.valid = await form.value.validate()
  if (formData.valid) {
    const data = {
      id: quest.value.id,
      lesson_id: formData.fields.lesson_id.value,
      code: formData.fields.code.value,
      value: formData.fields.value.value,
      date_start: formData.fields.date_start.value,
      date_end: formData.fields.date_end.value,
      is_disabled: formData.fields.is_disabled.value
    }
    const saveQuestResponse = await api.quest.saveItem(data)
    if (!saveQuestResponse.error) {
      // return router.go(-1)
    } else {
      for (const i in saveQuestResponse.messages) {
        formData.fields[i].errors = saveQuestResponse.messages[i]
      }
    }
  }
}
const loadData = async () => {
  const questItemResponse = await api.quest.getItem({ quest_id: route.params.quest_id })
  if (questItemResponse.error) {
    return router.go(-1)
  }
  quest.value = questItemResponse
  for (const k in formData.fields) {
    formData.fields[k].value = quest.value[k]
  }
  if (quest.value.date_start && quest.value.date_end) {
    dateRangeStatus.value = true
  }
  dateRange.value.from = quest.value.date_start.replaceAll('-', '/').substr(0, 10)
  dateRange.value.to = quest.value.date_end.replaceAll('-', '/').substr(0, 10)
  console.log(dateRange.value)
}
const loadLessonList = async (val, update, abort) => {
  const questLessonsResponse = await api.quest.getAvailableLessons({ title: val })
  if (questLessonsResponse.error) {
    // return router.go(-1)
  }
  formData.fields.lesson_id.options = questLessonsResponse
  update()
}

onMounted(() => {
  loadData()
})

watch(() => formData.fields.code.value, async (currentValue, oldValue) => {
  if (currentValue !== 'lesson') {
    formData.fields.lesson_id.value = null
  }
})
watch(() => dateRange.value, async (currentValue, oldValue) => {
  if (currentValue) {
    formData.fields.date_start.value = currentValue.from
    formData.fields.date_end.value = currentValue.to
  } else {
    formData.fields.date_start.value = null
    formData.fields.date_end.value = null
  }
})

watch(() => route.params.quest_id, (newData, oldData) => {
  loadData()
})
</script>
