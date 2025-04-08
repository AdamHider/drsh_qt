<template>
  <div v-if="formData.fields.length > 0">
    <div v-for="(input, index) in formData.fields" :key="index">
          <Teleport :to="`\#input_${input.index}`">
            <div
              tabindex="-1"
              @focus="matchStart(index)"
              @blur="matchEnd"
              :ref="el => { fieldsRefs[index] = el }"
              :class="`q-lesson-field q-pb-xs ${(index == currentIndex) ? 'q-active' : ''} ${(formData.fields[index].answer) ? ((formData.fields[index].answer.is_correct) ? 'is-correct' : 'is-incorrect') : ''}`"
            >
              <q-chip
                :class="`q-lesson-field-value full-width text-center q-ma-none bg-white rounded-xs ${(input.value.text == '' || input.value.text == false) ? 'disabled': ''}`"
                size="16px"
                style="pointer-events: none" >
                <b v-if="input.value.text">{{ input.value.text }}</b>
                <b v-else>_</b>
              </q-chip>
            </div>
          </Teleport>
      </div>
      <q-card v-if="!lesson.active.page?.answer?.is_finished" flat class="text-dark" @mousedown.prevent="matchStart(currentIndex)">
          <q-card-section >
            <div class="flex justify-center wrap">
              <div v-for="(option, optionIndex) in lesson.active.page.data.match_variants" :key="optionIndex">
                <q-chip v-if="option.answer !== formData.fields[currentIndex]?.value.text" class="q-lesson-field-value bg-white rounded-xs" size="18px"
                  :color="(option.selected) ? 'grey-3' : 'white'"
                  clickable @click.stop="selectVariant(option.answer)">
                  <b>{{ option.answer }}</b>
                </q-chip>
                <q-chip v-else class="q-lesson-field-value rounded-sm" size="18px" clickable @click.stop="clearVariant()" color="secondary" text-color="white">
                  <b>{{ option.answer }}</b>
                </q-chip>
              </div>
            </div>
          </q-card-section>
      </q-card>
      <q-card v-else flat class="text-dark" @mousedown.prevent="matchStart(currentIndex)">
        <q-card-section v-if="currentIndex !== null">
          <div class="flex justify-center wrap">
            <div v-for="(option, optionIndex) in lesson.active.page.data.match_variants" :key="optionIndex">
              <q-chip v-if="formData.fields[currentIndex] && option.answer !== formData.fields[currentIndex]?.value?.text" class="q-lesson-field-value rounded-xs" size="18px"
                :color="(formData.fields[currentIndex].answer.answer == option.answer) ? 'positive' : 'white'"
                :text-color="(formData.fields[currentIndex].answer.answer == option.answer) ? 'white' : 'dark'">
                <b>{{ option.answer }}</b>
              </q-chip>
              <q-chip v-else class="q-lesson-field-value rounded-sm" size="18px" icon="done"
                :color="(formData.fields[currentIndex]?.answer?.answer == option.answer) ? 'positive' : 'negative'"
                text-color="white">
                <b>{{ option.answer }}</b>
              </q-chip>
            </div>
          </div>
        </q-card-section>
      </q-card>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useLesson } from '../../../composables/useLesson'

const emits = defineEmits(['update-answer', 'onAnswerSaved'])
const { lesson } = useLesson()
const currentIndex = ref(null)
const matchMode = ref(false)
const fieldsRefs = ref([])

const formData = reactive({
  fields: []
})
const renderFields = () => {
  formData.fields = []
  if (!lesson.active.page.fields) return
  for (const k in lesson.active.page.fields) {
    const field = lesson.active.page.fields[k]
    let value = {
      text: ''
    }
    let options = []
    if (field.answer) {
      value.text = field.answer.value
      options = []
    }
    formData.fields.push({ value, options, index: field.index, answer: field.answer })
  }
  emits('update-answer', formData.fields)
}

const matchEnd = (variantIndex) => {
  currentIndex.value = null
}

const matchStart = (fieldIndex) => {
  if (lesson.active.page.answers) return
  currentIndex.value = fieldIndex
}
const selectVariant = (text) => {
  for(var i in formData.fields){
    if(formData.fields[i].value.text == text) formData.fields[i].value.text = ''
  }

  if(!formData.fields[currentIndex.value]){
    currentIndex.value = 0
    fieldsRefs.value[currentIndex.value].focus()
  }
  formData.fields[currentIndex.value].value.text = text
  calculateSelected()
}
const clearVariant = (text) => {
  formData.fields[currentIndex.value].value.text = ''
  calculateSelected()
}

const calculateSelected = () => {

  for(var k in lesson.active.page.data.match_variants){
    lesson.active.page.data.match_variants[k].selected = false
    for(var i in formData.fields){
        if(lesson.active.page.data.match_variants[k].answer == formData.fields[i].value.text) {
          lesson.active.page.data.match_variants[k].selected = true
        }
    }
  }
}

renderFields()

watch(() => lesson.active.page, (newValue, oldValue) => {
  renderFields()
})

watch(formData.fields, (newValue, oldValue) => {
  emits('update-answer', formData.fields)
})
</script>
<style scoped lang="scss">
.q-lesson-field {
  display: inline-block;
  min-width: 35px;
  border-bottom: 2px solid lightgray;
  box-shadow: none;
  overflow: hidden;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  &.is-inactive:not(.is-answered):before{
    top: 100%;
    height: 2px;
    background: $primary;
    animation: pulseBottomLessonField 1.5s infinite;
  }
  &.is-answered{
    background: none !important;
    box-shadow: none !important;
  }
  &.q-active{
    background: none !important;
    box-shadow: none !important;
    border-color: $primary;
  }
  .q-lesson-field-value{
    margin: 0;
  }
}
</style>
