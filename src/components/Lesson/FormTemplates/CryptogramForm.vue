
<template>
  <div v-if="formData.fields.length > 0" class="q-pa-sm">
    <div v-for="(input, index) in formData.fields" :key="input.index">
      <Teleport :to="`#input_${input.index}`">
        <div
          tabindex="-1"
          @focus="currentIndex = index; playAudio('click')"
          @click="(formData.fields[index].answer && !formData.fields[index].answer.is_correct) ? input.modal = true : ''"
          :class="`q-lesson-field  ${(index === currentIndex) ? 'q-active' : ''} ${(input.answer) ? ((input.answer.is_correct) ? 'is-answered is-correct' : 'is-answered is-incorrect') : ''}`"
        >
          <span :class="`q-lesson-field-value  ${(input.value.text) ? 'text-primary' : 'text-grey-4'} ${(!input.value.text) ? 'is-question' : ''}`">
            {{ transliterateHTML(input.value.text) || '?' }}
          </span>
        </div>
        <q-dialog v-model="input.modal" position="right">
          <q-card flat class="relative-position allow-overflow rounded-r-0">
            <q-img class="absolute" width="100px" style="bottom: 100%;" src="/images/characters/codex_full.png"/>
              <q-card-section>
                <div>
                  <div class="text-subtitle1 text-no-wrap q-mr-sm"><b>Твой ответ: </b></div>
                  <div class="flex wrap items-center">
                    <div v-for="(option, optionIndex) in input.answer.value.split('|')" :key="optionIndex">
                      <q-chip class="q-lesson-field-value rounded-xs" size="16px"
                        color="negative"
                        text-color="white">
                        <b>{{ transliterateHTML(option) }}</b>
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
                        <b>{{ transliterateHTML(option) }}</b>
                      </q-chip>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
        </q-dialog>
      </Teleport>
    </div>

    <div v-if="!lesson.active.page?.answer?.is_finished" class="keyboard-container q-mt-md">
      <div v-for="(row, rIdx) in keyboardRows" :key="rIdx" class="row no-wrap justify-center q-mb-xs">
        <q-btn
          v-for="key in row" :key="key" :label="key"
          @click="selectLetter(key); playAudio('click')"
          push dense
          :class="`key-cap ${(!isLetterInMapping(key)) ? 'key-absent' : ''} ${(completedLetters.has(key)) ? 'key-completed' : ''}`"
          :disable="!isLetterInMapping(key) || completedLetters.has(key)"
        ><q-icon class="absolute-top" size="10px" style="left: unset; top: 2px; right: 2px" v-if="completedLetters.has(key)" name="check"/></q-btn>
        <q-btn v-if="rIdx === 2" @click="clearLetter" class="key-cap key-del" push  dense><q-icon size="14px" name="backspace"></q-icon></q-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, nextTick } from 'vue'
import { useLesson } from '../../../composables/useLesson'
import { playAudio } from 'src/services/audioService'
import { useTransliterate } from '../../../composables/useTransliterate'

const { transliterateHTML } = useTransliterate()

const emits = defineEmits(['update-answer'])
const { lesson } = useLesson()

const currentIndex = ref(null)
const formData = reactive({ fields: [] })
const completedLetters = reactive(new Set())

const keyboardRows = [
  "ЙЦУКЕНГШЩЗХЪ".split(""),
  "ФЫВАПРОЛДЖЭ".split(""),
  "ЯЧСМИТЬБЮЁ".split("")
]

const isLetterInMapping = (key) => !!lesson.active.page?.data?.mapping?.[key]

const updateCompletedStatus = () => {
  const data = lesson.active.page?.data
  if (!data?.mapping || !data?.letter_list) return

  completedLetters.clear()
  const mapping = data.mapping
  const letterList = data.letter_list

  for (const char in mapping) {
    const targetSymbol = String(mapping[char])

    const totalPositions = letterList.filter(item => String(item.symbol) === targetSymbol).length

    const openedByServer = letterList.filter(item => item.text === char).length

    const typedByUser = formData.fields.filter(f => f.value.text === char).length

    if (totalPositions > 0 && (typedByUser + openedByServer) >= totalPositions) {
      completedLetters.add(char)
    }
  }
}

const renderFields = async () => {
  if (!lesson.active.page?.fields) return

  await nextTick()
  formData.fields = []
  for (const k in lesson.active.page.fields) {
    const field = lesson.active.page.fields[k]
    let value = {
      text: ''
    }
    if (field.answer) {
      value.text = field.answer.value
      value.is_finished = true
    }
    formData.fields.push({
      value,
      index: field.index,
      answer: field.answer
    })
  }
  if (currentIndex.value === null && formData.fields.length > 0) {
    const firstEmpty = formData.fields.findIndex(f => !f.value.text)
    currentIndex.value = firstEmpty !== -1 ? firstEmpty : 0
  }

  updateCompletedStatus()
  emits('update-answer', formData.fields)
}

const selectLetter = (letter) => {
  if (currentIndex.value === null) return
  playAudio('click')
  formData.fields[currentIndex.value].value.text = letter
  updateCompletedStatus()
  const nextEmpty = formData.fields.findIndex((f, i) => i > currentIndex.value && !f.value.text)
  if (nextEmpty !== -1) currentIndex.value = nextEmpty
}
const matchEnd = (evt) => {
  if(evt.explicitOriginalTarget.nodeName == '#text' || !evt.explicitOriginalTarget.closest(".q-field")) currentIndex.value = null;
}
const clearLetter = () => {
  if (currentIndex.value === null) return
  formData.fields[currentIndex.value].value.text = ''
  updateCompletedStatus()
}

onMounted(renderFields)
watch(() => lesson.active.page, renderFields, { deep: true, immediate: true })

watch(formData.fields, (newValue, oldValue) => {
  emits('update-answer', formData.fields)
})
</script>

<style lang="scss" scoped>
.q-lesson-field {
  vertical-align: middle;
  display: inline-block;
  position: relative;
  width: 30px;
  box-shadow: none;
  min-height: 2.3em;
  &:before{
    content: "";
    position: absolute;
    left: 0;
    top: 4px;
    width: 100%;
    height: 100%;
    border-bottom: 2px dotted #00000083;
    border-radius: 8px 8px 0 0  !important;
    box-shadow: none !important;
    opacity: 1;
    /*animation: pulseBottomLessonField 1.5s infinite alternate;*/
    animation:none  !important;
    transition: 0.3s all ease;
  }
  &.q-active{
    border-color: $primary;
    background: $grey-3 !important;
    &:before{
      top: 4px !important;
    }
    .q-lesson-field-value{
      color: $primary !important;
      &.is-question{
        color: $grey-3 !important;
      }
    }
  }
  &.is-correct{
    border: none;
    .q-lesson-field-value{
      background: $positive !important;
      color: white !important;
      &.is-question{
        margin-top: -3px !important;
        border-bottom: 3px solid rgba(0, 0, 0, 0.15);
        box-shadow: inset 0px 0px 0px 2px rgba(25, 210, 65, 0.5) !important;
      }
    }
  }
  &.is-incorrect{
    border: none;
    .q-lesson-field-value{
      background: $negative !important;
      color: white !important;
      &.is-question{
        margin-top: -3px !important;
        border-bottom: 3px solid rgba(0, 0, 0, 0.15);
        box-shadow: inset 0px 0px 0px 2px rgba(0, 0, 0, 0.15) !important;
      }
    }
  }
  .q-lesson-field-value{
    margin: 0;
    font-size: 1.2em;
    padding: 0.4em 0;
    font-weight: bold;
    width: 30px;
    display: block;
    text-align: center;
    height: auto;
    background: none !important;
    margin-top: -3px;
    &.is-question{
      box-shadow: none !important;
      border: none;
      margin-top: 0 !important;
    }
  }
}


.keyboard-container {
  max-width: 650px;
  margin: 0 auto;
}

.key-cap {
  background: white;
  flex: 1;
  height: 48px;
  margin: 4px;
  min-width: 30px;
  font-weight: bold;
  border-radius: 5px;
  color: $primary;
  text-shadow: none;
  transition: all 0.2s ease;

  // Буквы, которых нет в маппинге (не используются в шифре)
  &.key-absent {
    background: #ffffff;
    pointer-events: none;
    color: $grey-5;
    opacity: 0.3 !important;
  }

  // Буква заполнена во всех положенных местах
  &.key-completed {
    background: $green-5 !important;
    color: white !important;
  }

  &:active {
    transform: translateY(2px);
    box-shadow: none;
  }
}

.key-del {
  background: $negative;
  color: white !important;
}

// Адаптив для мобилок
@media (max-width: 600px) {
  .key-cap {
    height: 42px;
    margin: 2px;
    font-size: 0.9rem;
    min-width: 24px;
  }
}
</style>
