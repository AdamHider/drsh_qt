<template>
  <q-page-wrapper>
    <q-app-header class="bg-white rounded-b-md bordered" reveal>
        <q-btn flat icon="arrow_back"  @click="$router.go(-1);" v:slot="back-button"/>
        <q-toolbar-title>Quest Edit</q-toolbar-title>
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
              @change="loadReward"
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
              v-if="formData.fields.code.value !== 'lesson'"
              outlined
              type="number"
              v-model="formData.fields.value.value"
              :rules="formData.fields.value.rules"
              :error-message="formData.fields.value.errors"
              :error="formData.fields.value.errors !== ''"
              label="Goal value"
              required
              class="q-pt-sm q-pb-md"
              @change="loadReward"
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
            <div  v-if="formData.fields.value.value > 0" class="text-bold q-my-md">Reward</div>
            <q-list v-if="formData.fields.value.value > 0">
              <q-item tag="label" v-ripple>
                <q-item-section avatar>
                  <q-radio v-model="formData.fields.reward.value" val="no_reward" color="grey" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>No reward</q-item-label>
                </q-item-section>
              </q-item>
              <q-item tag="label" v-ripple>
                <q-item-section avatar>
                  <q-radio v-model="formData.fields.reward.value" val="experience" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label><b>{{rewardItem.experience}} XP</b></q-item-label>
                  <q-item-label caption>Experience points</q-item-label>
                </q-item-section>
              </q-item>
              <q-item tag="label" v-ripple>
                <q-item-section avatar top>
                  <q-radio v-model="formData.fields.reward.value" val="credits" color="positive" />
                </q-item-section>
                <q-item-section>
                  <q-item-label><b>{{rewardItem.credits}} Credits</b></q-item-label>
                  <q-item-label caption>Credit points</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
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

const rewardItem = ref({
  experience: 0,
  credits: 0
})

const formData = reactive({
  valid: true,
  fields: {
    lesson_id: {
      value: 0,
      options: [],
      errors: ''
    },
    code: {
      value: '',
      rules: [
        v => !!v || 'Code is required'
      ],
      errors: '',
      options: []
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
    reward: {
      value: '',
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
      reward: null,
      is_disabled: formData.fields.is_disabled.value
    }
    if (formData.fields.reward.value !== 'no_reward') {
      data.reward = { [formData.fields.reward.value]: rewardItem.value[formData.fields.reward.value] }
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
  if (!route.params.quest_id) return
  const questItemResponse = await api.quest.getItem({ quest_id: route.params.quest_id })
  if (questItemResponse.error) {
    return router.go(-1)
  }
  quest.value = questItemResponse
  for (const k in formData.fields) {
    formData.fields[k].value = quest.value[k]
  }
  if (quest.value.lesson_id) {
    formData.fields.lesson_id.options.push({
      id: quest.value.lesson_id,
      title: quest.value.lesson_title,
      image: quest.value.lesson_image
    })
  }
  if (quest.value.reward) {
    if (quest.value.reward.experience) formData.fields.reward.value = 'experience'
    if (quest.value.reward.credits) formData.fields.reward.value = 'credits'
  } else {
    formData.fields.reward.value = 'no_reward'
  }

  if (quest.value.date_start && quest.value.date_end) {
    dateRangeStatus.value = true
    dateRange.value.from = quest.value.date_start.replaceAll('-', '/').substr(0, 10)
    dateRange.value.to = quest.value.date_end.replaceAll('-', '/').substr(0, 10)
  }
}
const loadReward = async () => {
  if (!route.params.quest_id) return
  const questItemRewardResponse = await api.quest.calculateReward({ quest_id: route.params.quest_id, code: formData.fields.code.value, value: formData.fields.value.value })
  if (questItemRewardResponse.error) {
    return
  }
  rewardItem.value = questItemRewardResponse
}
const loadCodes = async () => {
  if (!route.params.quest_id) return
  const questItemCodesResponse = await api.quest.getAvailableCodes({ classroom_id: quest.value.classroom_id })
  if (questItemCodesResponse.error) {
    return
  }
  formData.fields.code.options = questItemCodesResponse
}

const loadLessonList = async (val, update, abort) => {
  const questLessonsResponse = await api.quest.getAvailableLessons({ title: val })
  if (questLessonsResponse.error) {
    // return router.go(-1)
  }
  formData.fields.lesson_id.options = questLessonsResponse
  update()
}

onMounted(async () => {
  await loadData()
  await loadCodes()
  await loadReward()
})

watch(() => formData.fields.code.value, async (currentValue, oldValue) => {
  if (currentValue !== 'lesson') {
    formData.fields.lesson_id.value = null
  } else {
    formData.fields.value.value = 1
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
watch(() => route.params.quest_id, async (currentValue, oldData) => {
  await loadData()
  await loadReward()
})
</script>
