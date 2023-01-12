<template>
  <div v-if="formData.fields.length > 0">
        <div v-for="(input, index) in formData.fields" :key="index">
            <Teleport :to="`\#input_${input.index}`">
                <q-checkbox
                  v-if="!formData.fields[index].answer"
                  v-model="formData.fields[index].value"
                  :label="formData.fields[index].label"
                />

                <q-chip
                  v-else
                  size="15px"
                  :icon="(formData.fields[index].answer && formData.fields[index].answer.value == 'true') ? 'check' : 'check_box_outline_blank'"
                  color="transparent"
                  :text-color="(formData.fields[index].answer) ? ((formData.fields[index].answer.is_correct) ? 'positive' : 'negative') : 'primary'"
                >
                  {{ formData.fields[index].label }}
                </q-chip>
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
  if (!lesson.active.page.fields) return
  for (const k in lesson.active.page.fields) {
    const field = lesson.active.page.fields[k]
    let value = false
    let options = field.variants
    if (field.answer) {
      value = field.answer.value
      options = []
    }
    formData.fields.push({ value, options, index: field.index, answer: field.answer, label: field.label })
  }
  console.log(formData.fields)
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
