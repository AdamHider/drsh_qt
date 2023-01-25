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
            @keydown.enter.prevent="saveAnswer"
            @paste="e => e.preventDefault()"
            class="full-width"
            style="align-self: end;"
        >

            <template v-slot:prepend>
              <q-btn-dropdown flat class="q-pa-sm" color="gray"  dropdown-icon="more_vert">
                <q-list>
                  <q-item clickable
                      :disable="(
                      lesson.active.page?.exercise.data.current_page == 0
                      || lesson.active.page?.exercise.data.back_attempts == 0
                      )"
                      @click="backDialog=true">
                      <q-item-section>
                          <q-item-label>Previous exercise</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                          <q-avatar
                              size="sm"
                              :color="(lesson.active.page?.exercise.data.back_attempts > 1) ? 'positive' : 'negative' "
                              text-color="white"
                          >
                              {{ lesson.active.page?.exercise.data.back_attempts }}
                          </q-avatar>
                      </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </template>
            <template v-slot:append>
              <q-btn round dense flat icon="send" :disabled="!formData.fields[currentFieldIndex]?.value" @click="saveAnswer" />
            </template>
        </q-input>
      </q-card-section>
    </q-card>
  </q-page-sticky>

  <q-dialog v-model="backDialog"  transition-show="scale" transition-hide="scale">
      <q-card class="bg-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">Persistent</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          Click/Tap on the backdrop.
        </q-card-section>
        <q-card-actions align="center" class="bg-white text-teal">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn flat label="Continue" @click="back" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script setup>
import { ref, reactive, watch, defineEmits } from 'vue'
import { useLesson } from '../../../composables/useLesson'
import { onBeforeRouteLeave } from 'vue-router'

const emits = defineEmits(['update-answer', 'onAnswerSaved', 'onPageChanged'])
const { lesson } = useLesson()

const backDialog = ref(false)
const currentFieldIndex = ref(0)
const currentTip = ref(false)
const currentTipCorrect = ref(null)
const currentTipCorrectness = ref(0)

const formData = reactive({
  fields: []
})

const renderFields = () => {
  formData.fields = { }
  if (!lesson.active.page.fields || lesson.active.page.answers.is_finished) return
  let lastAnswerIndex = 0
  if (lesson.active.page.answers.answers) {
    lastAnswerIndex = (lesson.active.page.answers.answers?.length - 1)
    const lastExistingAnswer = lesson.active.page.answers.answers[lastAnswerIndex]
    if (lastExistingAnswer && !lastExistingAnswer.is_temp) {
      lastAnswerIndex++
    }
  }
  currentFieldIndex.value = lastAnswerIndex
  formData.fields[currentFieldIndex.value] = lesson.active.page.fields[currentFieldIndex.value]
  emits('update-answer', formData.fields)
}
const onInput = function () {
  currentTipCorrectness.value = 0
  currentTip.value = formData.fields[currentFieldIndex.value]?.variants[0]
  if (!formData.fields[currentFieldIndex.value]?.value) return
  for (const i in formData.fields[currentFieldIndex.value].variants) {
    const tip = formData.fields[currentFieldIndex.value].variants[i]
    currentTipCorrect.value = findTip(tip)
    if (currentTipCorrect.value) {
      currentTipCorrectness.value = Math.round(formData.fields[currentFieldIndex.value].value.length * 100 / tip.length)
      currentTip.value = tip
      return
    }
  }
}

const saveAnswer = function () {
  if (!formData.fields[currentFieldIndex.value].value) return false
  emits('onAnswerSaved')
}
renderFields()

const back = async () => {
  emits('onPageChanged', 'previous')
}
onBeforeRouteLeave((to, from) => {
  if (backDialog.value) {
    backDialog.value = false
    return false
  }
  return true
})

watch(() => lesson.active.page, (newValue, oldValue) => {
  currentFieldIndex.value = 0
  renderFields()
})
watch(() => currentFieldIndex, (newValue, oldValue) => {
  onInput()
})

watch(() => formData.fields[currentFieldIndex.value]?.value, (newValue, oldValue) => {
  emits('update-answer', formData.fields)
  onInput()
})

const findTip = function (answer) {
  let simplifiedInput = simplifyUserInput(formData.fields[currentFieldIndex.value].value)
  let simplifiedAnswer = simplifyUserInput(answer)
  /* =========NON STRICT MATCH========= */

  simplifiedInput = simplifySpecialChars(simplifiedInput)
  simplifiedAnswer = simplifySpecialChars(simplifiedAnswer)

  /* =========NON STRICT MATCH========= */

  const simplifiedInputExploded = simplifiedInput.trim().split(' ')
  const simplifiedAnswerExploded = simplifiedAnswer.trim().split(' ')
  /*
  if (mod_languages.current_writing_mode == 'cyrillic') {
    tip = transliterate(tip, 'cyrillize')
  }
  */
  let total = 0
  let correct = 0
  if (simplifiedInputExploded.length > simplifiedAnswerExploded.length) {
    return false
  }
  for (let i = 0; i < simplifiedInputExploded.length; i++) {
    total++
    if (simplifiedAnswerExploded[i] === '{name}' || (simplifiedAnswerExploded[i] && simplifiedAnswerExploded[i].indexOf('_') === 0)) {
      correct++
      continue
    }
    if (simplifiedAnswerExploded[i].indexOf(simplifiedInputExploded[i]) === 0) {
      correct++
      continue
    }
    if (simplifiedAnswerExploded[i] !== simplifiedInputExploded[i]) {
      continue
    }
  }

  return total === correct
}

const simplifyUserInput = function (str) {
  str = str.toLowerCase()
  const findArray = [',', '.', ')', '!', '?', '-', '  ', '   ', '   ']
  const replaceArray = ['', '', '', '', '', '', ' ', ' ', ' ']
  let i, regex = []
  const map = {}
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
  let i, regex = []
  const map = {}
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
