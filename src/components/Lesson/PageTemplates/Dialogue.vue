<template>
    <q-card>
        <q-img
            cover
            width="250px"
            :src="`${CONFIG.API_HOST}/${pageData?.data.image}`" />
    </q-card>
    <q-list>
      <q-item  v-for="(replica, index) in replicaList.list" :key="index" >
        <q-item-section avatar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/avatar2.jpg">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1"><b>{{ replica.name }}</b></q-item-label>
          <q-item-label lines="2" v-html="replica.text"></q-item-label>
        </q-item-section>
        <q-item-section side top>
          1 min ago
        </q-item-section>
      </q-item>
    </q-list>
    <div v-if="formData.fields.length > 0">
        <div v-for="(input, index) in formData.fields" :key="index">
            <Teleport :to="`\#input_${input.index}`">
                <q-select
                    dense
                    hide-dropdown-icon
                    v-model="formData.fields[index].value"
                    :options="formData.fields[index].options"
                    :color="(formData.fields[index].answer) ? ((formData.fields[index].answer.is_correct == 'correct') ? 'green' : 'negative') : 'primary'"
                    :style="{ display: 'inline-block', minWidth: '50px', height: '18px', justifyContent: 'center', verticalAlign: 'bottom'  }"
                    behavior="menu"
                    :class="`q-select-inline ${(formData.fields[index].answer) ? ((formData.fields[index].answer.is_correct == 'correct') ? 'correct-answer' : 'wrong-answer') : ''}`"
                    highlighted
                >
                    <template v-slot:no-option v-if="formData.fields[index].answer">
                        <q-item>
                            <q-item-section>
                                <q-item-label v-if="formData.fields[index].value !== ''">
                                    Your answer:
                                    <b :class="`text-${(formData.fields[index].answer.is_correct == 'correct') ? 'positive' : 'negative'}`">
                                        {{ formData.fields[index].value }}
                                    </b>
                                </q-item-label>
                                <q-item-label v-else>
                                    <b class="text-negative">Empty answer</b>
                                </q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item v-if="formData.fields[index].answer.is_correct == 'wrong'" class="q-pt-none">
                            <q-item-section>
                                <q-item-label>Correct answer: <b  class="text-positive">{{ formData.fields[index].answer.correct_answer }}</b></q-item-label>
                            </q-item-section>
                        </q-item>
                    </template>
                </q-select>
            </Teleport>
        </div>
</div>

</template>

<script setup>
import { reactive, watch, defineEmits, onActivated } from 'vue'
import { useLesson } from '../../../composables/useLesson'
import { CONFIG } from '../../../config.js'

const { lesson } = useLesson()
const emits = defineEmits(['update-answer'])

const replicaList = reactive({
  list: []
})
const formData = reactive({
  fields: []
})
const renderData = () => {
  console.log('renderData')
  replicaList.list = []
  for (const i in lesson.active.page.data.replica_list) {
    if (lesson.active.page.data.replica_list[i].text.indexOf('input') > -1) {
      const inputIndex = lesson.active.page.data.replica_list[i].text.match(/{{input[0-9]+}}/g)[0].match(/[0-9]+/g)[0]
      lesson.active.page.data.replica_list[i].text = lesson.active.page.data.replica_list[i].text.replace(/\{\{input[0-9]+\}\}/, `<span id="input_${inputIndex}"></span>`)
    }
    replicaList.list.push(lesson.active.page.data.replica_list[i])
  }
}
const renderFields = () => {
  if (!lesson.active.page.fields) return
  for (const k in lesson.active.page.fields) {
    const field = lesson.active.page.fields[k]
    let value = ''
    let options = field.variants
    if (field.answer) {
      if (field.answer.is_correct == 'wrong') {
        value = field.answer.wrong_answer
        options = []
      } else {
        value = field.answer.correct_answer
        options = []
      }
    }
    formData.fields.push({ value, options, index: field.index, answer: field.answer })
  }
  emits('update-answer', formData.fields)
}

renderData()
renderFields()

onActivated(() => {
  renderData()
  renderFields()
})

watch(formData.fields, (newValue, oldValue) => {
  emits('update-answer', formData.fields)
})

</script>

<style lang="scss">
.q-select.q-select-inline .q-field__control,
.q-select.q-select-inline .q-field__native {
  min-height: 18px;
  padding: 0;
}

.q-select.correct-answer.q-field--standard .q-field__control::before{
    border-color: $positive;
}
.q-select.wrong-answer.q-field--standard .q-field__control::before{
    border-color: $negative;
}
</style>
