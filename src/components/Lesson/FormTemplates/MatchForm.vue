<template>
  <div v-if="formData.fields.length > 0">
    <div v-for="(input, index) in formData.fields" :key="index">
          <Teleport :to="`\#input_${input.index}`">
            <div
              tabindex="-1"
              @focus="matchStart(index); playAudio('click')"
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
            <q-btn v-if="input.answer && !input.answer.is_correct" flat dense color="grey" icon="help_outline" @click="input.modal = true"></q-btn>
            <q-dialog v-model="input.modal" position="right">
              <q-card flat class="relative-position allow-overflow rounded-r-0">
                <q-img class="absolute" width="100px" style="bottom: 100%;" src="/images/characters/codex_full.png"/>
                  <q-card-section>
                    <div>
                      <div class="text-subtitle1 text-no-wrap q-mr-sm"><b>Ваш ответ: </b></div>
                      <div class="flex wrap items-center">
                        <div v-for="(option, optionIndex) in input.answer.value.split('|')" :key="optionIndex">
                          <q-chip class="q-lesson-field-value rounded-xs" size="16px"
                            color="negative"
                            text-color="white">
                            <b>{{ option }}</b>
                          </q-chip>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div class="text-subtitle1 text-no-wrap q-mr-sm"><b>Правильный ответ: </b></div>
                      <div class="flex items-center wrap">
                        <div v-for="(option, optionIndex) in input.answer.answer.split('|')" :key="optionIndex">
                          <q-chip class="q-lesson-field-value rounded-xs" size="16px"
                            color="positive"
                            text-color="white">
                            <b>{{ option }}</b>
                          </q-chip>
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
            </q-dialog>
          </Teleport>
      </div>
      <q-card v-if="currentIndex !== null && !formData.fields[currentIndex].answer" flat class="text-dark" @mousedown.prevent="matchStart(currentIndex)">
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
      <q-card v-else-if="!lesson.active.page?.answer?.is_finished" flat class="text-dark">
        <q-card-section class="text-center">
          <div class="text-h6 text-bold">Выберите поле</div>
          <div class="text-subtitle2">И здесь появятся варианты ответа</div>
        </q-card-section>
      </q-card>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useLesson } from '../../../composables/useLesson'
import { playAudio } from 'src/services/audioService';



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
  playAudio('click')
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
  playAudio('click')
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
