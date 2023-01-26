<template>
  <div v-if="formData.fields.length > 0">
        <div v-for="(input, index) in formData.fields" :key="index">
            <Teleport :to="`\#input_${input.index}`">
                <q-select
                    dense
                    hide-dropdown-icon
                    v-model="formData.fields[index].value"
                    :options="formData.fields[index].options"
                    :color="(formData.fields[index].answer) ? ((formData.fields[index].answer.is_correct) ? 'positive' : 'negative') : 'primary'"
                    :style="{ display: 'inline-block', minWidth: '50px', height: '18px', justifyContent: 'center', verticalAlign: 'bottom'  }"
                    behavior="menu"
                    :class="`q-select-inline ${(formData.fields[index].answer) ? ((formData.fields[index].answer.is_correct) ? 'correct-answer' : 'wrong-answer') : ''}`"
                    highlighted
                >
                    <template v-slot:no-option v-if="formData.fields[index].answer">
                        <q-item>
                            <q-item-section>
                                <q-item-label v-if="formData.fields[index].value !== ''">
                                    Your answer:
                                    <b :class="`text-${(formData.fields[index].answer.is_correct) ? 'positive' : 'negative'}`">
                                        {{ formData.fields[index].value }}
                                    </b>
                                </q-item-label>
                                <q-item-label v-else>
                                    <b class="text-negative">Empty answer</b>
                                </q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item v-if="!formData.fields[index].answer.is_correct" class="q-pt-none">
                            <q-item-section>
                                <q-item-label>Correct answer: <b  class="text-positive">{{ formData.fields[index].answer.answer }}</b></q-item-label>
                            </q-item-section>
                        </q-item>
                    </template>
                </q-select>
            </Teleport>
        </div>
  </div>
</template>

<script setup>
import { reactive, watch, defineEmits } from 'vue'
import { useLesson } from '../../../composables/useLesson'

const emits = defineEmits(['update-answer', 'onAnswerSaved'])
const { lesson } = useLesson()

const formData = reactive({
  fields: []
})
const renderFields = () => {
  formData.fields = []
  if (!lesson.active.page?.fields) return
  for (const k in lesson.active.page.fields) {
    const field = lesson.active.page.fields[k]
    let value
    let options = field.variants
    if (field.answer) {
      value = field.answer.value
      options = []
    }
    formData.fields.push({ value, options, index: field.index, answer: field.answer })
  }
  emits('update-answer', formData.fields)
}

renderFields()

watch(() => lesson.active.page, (newValue, oldValue) => {
  renderFields()
})

watch(formData.fields, (newValue, oldValue) => {
  emits('update-answer', formData.fields)
})
</script>
