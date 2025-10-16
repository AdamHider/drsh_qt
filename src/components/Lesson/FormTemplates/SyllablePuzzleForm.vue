<template>
  <div v-if="activeInputs.length > 0" class="q-mb-md">
        <div :class="`q-ma-sm flex justify-center items-center q-pa-xs bg-grey-3 rounded-sm`"  >
          <div style="flex:1" class="flex justify-center ">
            <div v-for="(option, optionIndex) in selectedSyllables" :key="optionIndex">
              <q-chip :class="`q-lesson-field-value bg-white rounded-xs ${(isAnswered) ? 'is-correct': ''}`" size="20px" clickable @click.stop="selectVariant(option, optionIndex)">
                <b>{{ transliterateHTML(option) }}</b>
              </q-chip>
            </div>
          </div>
            <div :style="(selectedSyllables.length > 0) ? '' : 'pointer-events: none'">
              <q-chip class="q-lesson-field-value rounded-sm" :size="(isLetterly) ? '20px' : '18px'" @click.stop="clearVariant()" :color="(selectedSyllables.length == 0) ? 'red-5' : 'negative'" text-color="white" :clickable="!isAnswered">
                <q-icon name="keyboard_backspace"></q-icon>
              </q-chip>
            </div>
        </div>
        <div class="flex justify-center wrap">
          <div v-for="(option, optionIndex) in activeSyllables" :key="optionIndex">
            <q-chip :class="`q-lesson-field-value bg-white rounded-xs ${(selectedSyllablesIndexes.includes(optionIndex)) ? 'bg-orange text-white' : ''} `" size="20px" style="width: 50px; height: 50px;" :clickable="option.text !== '' && !selectedSyllablesIndexes.includes(optionIndex) && !isAnswered" @click.stop="selectVariant(option, optionIndex)">
              <b>{{ transliterateHTML(option.text) }}</b>
            </q-chip>
          </div>
        </div>
  </div>
</template>

<script setup>
import { reactive, watch, ref } from 'vue'
import { useLesson } from '../../../composables/useLesson'
import { playAudio } from 'src/services/audioService';
import { useTransliterate } from '../../../composables/useTransliterate'

const { transliterateHTML } = useTransliterate()

const emits = defineEmits(['update-answer', 'onAnswerSaved'])
const { lesson } = useLesson()

const currentIndex = ref(null)
const isLetterly = ref(false)
const isAnswered = ref(false)
const formData = reactive({
  fields: []
})
const activeInputs = ref([])
const activeSyllables = ref([])
const selectedSyllables = ref([])
const selectedSyllablesIndexes = ref([])
const allSyllables = ref([])

const renderFields = () => {
  formData.fields = []
  if (!lesson.active.page?.fields) return
  for (const k in lesson.active.page.fields) {
    const field = lesson.active.page.fields[k]
    let value = {
      text: ''
    }
    if (field.answer) {
      value.text = field.answer.value
      value.is_finished = true
    }
    formData.fields.push({ value, index: field.index, answer: field.answer, syllables: field.syllables, scheme: field.scheme })
  }
  setAllSyllables()
  setActiveInputs()
  emits('update-answer', formData.fields)
}

const setActiveInputs = () => {
  activeInputs.value = []
  for(var i in formData.fields){
    if(!formData.fields[i].answer && activeInputs.value.length < 4){
      activeInputs.value.push(formData.fields[i])
    }
  }
}
const setActiveSyllables = () => {
  const totalSyllables = 20
  const active_syllables = allSyllables.value.filter((item) => {return item.status == 'active'})
  for(var i in active_syllables){
    if(active_syllables[i].status == 'active'  && i < totalSyllables){
        activeSyllables.value.push(active_syllables[i])
    }
  }
}
const setAllSyllables = () => {
  allSyllables.value = []
  for(var i in formData.fields){
    for(var k in formData.fields[i].syllables){
      let data = {
        text: formData.fields[i].syllables[k].text
      }
      if(formData.fields[i].answer){
        data.status = 'answered';
      } else {
        data.status = 'active'
      }
      allSyllables.value.push(data)
    }
  }
}
const getInactiveSyllables = () => {
  var result = [];
  const activeSyllablesCount = 20
  const active_syllables = allSyllables.value.filter((item) => {return item.status == 'active'})
  for(var i in active_syllables){
    if(i >= activeSyllablesCount){
      result.push(active_syllables[i])
    }
  }
  for(var k in selectedSyllablesIndexes.value){
    result.push({text: ""})
  }
  return result;
}
const createSeededPRNG = (seed) => {
    const m = 0x80000000;
    const a = 1103515245;
    const c = 12345;
    let state = seed % m;
    return () => {
        state = (a * state + c) % m;
        return state / m;
    };
};
const shuffleSyllables = (array, seed) => {
    const random = createSeededPRNG(seed);
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const selectVariant = (syllable, index) => {
  playAudio('click')
  selectedSyllables.value.push(syllable.text)
  selectedSyllablesIndexes.value.push(index)
  checkExistingScheme()
}
const clearVariant = (text) => {
  playAudio('click')
  selectedSyllables.value.pop()
  selectedSyllablesIndexes.value.pop()
}
const checkExistingScheme = () => {
  const scheme = selectedSyllables.value.join('|')
  const answer = selectedSyllables.value.join('')
  for(var i in activeInputs.value){
    if(!activeInputs.value[i].answer && activeInputs.value[i].scheme == scheme){
      activeInputs.value[i].value.text = answer
      activeInputs.value[i].value.is_finished = true
      saveAnswer()
    }
  }
}
const refillSyllablesFields = () => {
  var inactiveSyllables = getInactiveSyllables()
  for(var i in selectedSyllablesIndexes.value){
    activeSyllables.value[selectedSyllablesIndexes.value[i]] = inactiveSyllables[0]
    inactiveSyllables.shift();
  }
  selectedSyllables.value = []
  selectedSyllablesIndexes.value = []
}

const saveAnswer = function () {
  isAnswered.value = true
  setTimeout(() => {
    emits('onAnswerSaved')
    isAnswered.value = false
  }, 500)
}

renderFields()
setAllSyllables()
setActiveSyllables()
activeSyllables.value = shuffleSyllables(activeSyllables.value, lesson.active.id)

watch(() => lesson.active.page, (newValue, oldValue) => {
  refillSyllablesFields()
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
  box-shadow: none;
  margin: 2px;
  &.is-answered{
    box-shadow: none !important;
  }
  &.q-active{
    border-color: $primary;
    background: $grey-3 !important;
    &:before{
      top: 4px !important;
    }
  }
  &.has-value{
    &:before{
      top: 4px !important;
      opacity: 0;
    }
  }
  &.is-correct{
    background: none !important;
    border: none;
  }
  &.is-incorrect{
    background: none !important;
    border: none;
  }
}
.q-lesson-field-value{
  &.is-correct{
      background: $green-7 !important;
      color: white !important;
  }
}
</style>
