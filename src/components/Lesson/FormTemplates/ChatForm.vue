<template>
  <q-page-sticky expand position="bottom"  v-if="formData.fields[currentFieldIndex]">
    <q-card class="full-width" flat>
      <q-card-section class="q-py-none">
        <q-chip
          v-if="!currentTip"
          color="transparent"
          icon="help_outline"
          clickable @click="currentTip = formData.fields[currentFieldIndex].variants[0]"
        >
          I don't know what to answer
        </q-chip>
        <q-chip v-else
          color="transparent"
          :text-color="(formData.fields[currentFieldIndex].value) ? ((currentTipCorrect) ? 'positive' : 'negative') : 'grey'"
        >
          <q-avatar
            icon="lightbulb_outline"
            :color="(formData.fields[currentFieldIndex].value) ? ((currentTipCorrect) ? 'positive' : 'negative') : 'grey'"
            text-color="white"
          />
          {{ currentTip }}
        </q-chip>

        <q-input
            outlined
            autogrow
            bottom-slots
            placeholder="Enter message..."
            v-model="formData.fields[currentFieldIndex].value"
            class="full-width"
            style="align-self: end;"
        >

            <template v-slot:counter>
              <b>{{ currentTipCorrectness }}%</b>
            </template>
            <template v-slot:append>
              <q-btn round dense flat icon="send" @click="emits('onAnswerSaved')" />
            </template>
        </q-input>
      </q-card-section>
    </q-card>
  </q-page-sticky>
</template>

<script setup>
import { ref, reactive, watch, defineEmits } from 'vue'
import { useLesson } from '../../../composables/useLesson'

const emits = defineEmits(['update-answer', 'onAnswerSaved'])
const { lesson } = useLesson()

const currentFieldIndex = ref(0)
const currentTip = ref(false)
const currentTipCorrect = ref(null)
const currentTipCorrectness = ref(0)

const formData = reactive({
  fields: []
})

const renderFields = () => {
  formData.fields = {}
  if (!lesson.active.page.fields || lesson.active.page.answers.is_finished) return
  let lastAnswerIndex = 0
  if (lesson.active.page.answers.answers) {
    lastAnswerIndex = (lesson.active.page.answers.answers?.length - 1)
    const lastExistingAnswer = lesson.active.page.answers.answers[lastAnswerIndex]
    if (!lastExistingAnswer.is_temp) {
      lastAnswerIndex++
    }
  }
  currentFieldIndex.value = lastAnswerIndex
  formData.fields[currentFieldIndex.value] = lesson.active.page.fields[currentFieldIndex.value]
  emits('update-answer', formData.fields)
}
const onInput = function () {
  currentTipCorrectness.value = 0
  if (!formData.fields[currentFieldIndex.value].value) return
  for (const i in formData.fields[currentFieldIndex.value].variants) {
    const tip = formData.fields[currentFieldIndex.value].variants[i]
    currentTipCorrect.value = findTip(tip)
    if (currentTipCorrect.value) {
      currentTipCorrectness.value = Math.round(formData.fields[currentFieldIndex.value].value.length * 100 / tip.length)
      currentTip.value = tip
      return
    }
  }
  if (!currentTipCorrect.value) currentTip.value = formData.fields[currentFieldIndex.value].variants[0]
}
renderFields()

watch(() => lesson.active.page, (newValue, oldValue) => {
  currentFieldIndex.value = 0
  renderFields()
})

watch(formData.fields, (newValue, oldValue) => {
  emits('update-answer', formData.fields)
  onInput()
})

const findTip = function (answer) {
  var simplified_input = simplifyUserInput(formData.fields[currentFieldIndex.value].value)
  var simplified_answer = simplifyUserInput(answer)
  /* =========NON STRICT MATCH========= */
  var simplified_input = simplifySpecialChars(simplified_input)
  var simplified_answer = simplifySpecialChars(simplified_answer)
  /* =========NON STRICT MATCH========= */

  const simplified_input_exploded = simplified_input.trim().split(' ')
  const simplified_answer_exploded = simplified_answer.trim().split(' ')
  /*
  if (mod_languages.current_writing_mode == 'cyrillic') {
    tip = transliterate(tip, 'cyrillize')
  }
  */
  let total = 0
  let correct = 0
  if (simplified_input_exploded.length > simplified_answer_exploded.length) {
    return false
  }
  for (let i = 0; i < simplified_input_exploded.length; i++) {
    total++
    if (simplified_answer_exploded[i] == '{name}' || (simplified_answer_exploded[i] && simplified_answer_exploded[i].indexOf('_') === 0)) {
      correct++
      continue
    }
    if (simplified_answer_exploded[i].indexOf(simplified_input_exploded[i]) == 0) {
      correct++
      continue
    }
    if (simplified_answer_exploded[i] !== simplified_input_exploded[i]) {
      continue
    }
  }

  return total == correct
}

const simplifyUserInput = function (str) {
  str = str.toLowerCase()
  const findArray = [',', '.', ')', '!', '?', '-', '  ', '   ', '   ']
  const replaceArray = ['', '', '', '', '', '', ' ', ' ', ' ']
  let i, regex = [], map = {}
  for (i = 0; i < findArray.length; i++) {
    regex.push(findArray[i].replace(/([-[\]{}()*+?.\\^$|#,])/g, '\\$1'))
    map[findArray[i]] = replaceArray[i]
  }
  regex = regex.join('|')
  str = str.replace(new RegExp(regex, 'g'), function (matched) {
    return map[matched]
  })
  return str
}

const simplifySpecialChars = function (str) {
  str = str.toLowerCase()
  const findArray = ['ı', 'ğ', 'ü', 'ş', 'ö', 'ç', 'â', 'ñ']
  const replaceArray = ['i', 'g', 'u', 's', 'o', 'c', 'a', 'n']
  let i, regex = [], map = {}
  for (i = 0; i < findArray.length; i++) {
    regex.push(findArray[i].replace(/([-[\]{}()*+?.\\^$|#,])/g, '\\$1'))
    map[findArray[i]] = replaceArray[i]
  }
  regex = regex.join('|')
  str = str.replace(new RegExp(regex, 'g'), function (matched) {
    return map[matched]
  })
  return str
}
</script>
<style lang="scss" scoped>
.q-page-sticky--shrink > div{
  width: 100%;
}
.chat-suggestion{
  overflow: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.chat-suggestion::-webkit-scrollbar {
  display: none;
}

.chat-suggestion .chat-suggestion-container{
  display: flex;
  width: max-content;
}
</style>
