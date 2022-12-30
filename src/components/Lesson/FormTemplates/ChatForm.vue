<template>
    <q-input v-if="formData.fields[currentFieldIndex]"
        outlined
        autogrow
        placeholder="Enter message..."
        v-model="formData.fields[currentFieldIndex].value"
        :options="formData.fields[currentFieldIndex].options"
        class="full-width"
        style="align-self: end;"
    >
        <template v-slot:append>
        <q-btn round dense flat icon="send" @click="emits('onAnswerSaved')" />
        </template>
    </q-input>
</template>

<script setup>

import { ref, reactive, watch, defineEmits } from 'vue'
import { useLesson } from '../../../composables/useLesson'

const emits = defineEmits(['update-answer', 'onAnswerSaved'])
const { lesson } = useLesson()
const currentFieldIndex = ref(0)

const formData = reactive({
  fields: []
})
const renderFields = () => {
  formData.fields = {}
  if (!lesson.active.page.fields || lesson.active.page.answers.is_finished) return
  let lastAnswerIndex = 0
  if(lesson.active.page.answers.answers){
    lastAnswerIndex = (lesson.active.page.answers.answers?.length-1)
    const lastExistingAnswer = lesson.active.page.answers.answers[lastAnswerIndex]
    if(!lastExistingAnswer.is_temp){
        lastAnswerIndex++
    }
  }
  currentFieldIndex.value = lastAnswerIndex;
  formData.fields[currentFieldIndex.value] = lesson.active.page.fields[currentFieldIndex.value]
  console.log(lesson.active.page.fields[currentFieldIndex.value])
  emits('update-answer', formData.fields)
}

renderFields()

watch(() => lesson.active.page, (newValue, oldValue) => {
  currentFieldIndex.value = 0
  renderFields()
})

watch(formData.fields, (newValue, oldValue) => {
  emits('update-answer', formData.fields)
})
</script>
<style lang="scss" scoped>
.q-page-sticky--shrink > div{
  width: 100%;
}
</style>