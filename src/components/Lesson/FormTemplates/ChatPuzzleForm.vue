<template>
  <div v-if="formData.fields.length > 0">
    <div v-for="(input, index) in formData.fields" :key="index">
        <Teleport :to="`\#input_${input.index}`">
            <div
              tabindex="-1"
              @focus="matchStart(index)"
              clickable
              @blur="matchEnd"
              :class="`q-lesson-field q-pa-xs flex text-subtitle2 ${(index == currentIndex) ? 'q-active' : (input.value.text == '' || input.value.text == false) ? 'is-inactive' : ''} ${(input.answer) ? ((input.answer.is_correct) ? 'is-answered is-correct' : 'is-answered is-incorrect') : ''}`"
            >
              <q-item-section>
                <div v-if="!input.answer && (input.value.text == '' || input.value.text == false)">
                  <div class="text-caption q-px-sm text-grey-8"><b>Напиши сообщение...</b></div>
                </div>
                <div class="flex chip-container" v-else >
                  <div v-if="input.value.textFormatted" class="q-lesson-field-value-flat cursor-pointer">
                    <b>{{ input.value.textFormatted }}</b>
                    <q-btn v-if="input.answer && !input.answer.is_correct" flat dense color="grey" icon="help_outline" @click="input.modal = true"></q-btn>
                    <q-dialog v-model="input.modal" position="right">
                      <q-card flat class="relative-position allow-overflow rounded-r-0">
                        <q-img class="absolute" width="100px" style="bottom: 100%;" src="/images/characters/quest_character_full.png"/>
                        <q-card-section>
                          <div>
                            <div class="text-subtitle1 text-no-wrap q-mr-sm"><b>Твой ответ: </b></div>
                            <div class="flex items-center wrap" v-if="!input.answer.is_correct">
                              <b class="text-negative">{{ formatAnswer(input.answer.value.split('|')) }}</b>
                            </div>
                          </div>
                          <q-separator v-if="!input.answer.is_correct" class="q-my-sm"/>
                          <div>
                            <div class="text-subtitle1 text-no-wrap q-mr-sm"><b>Правильный ответ: </b></div>
                            <div class="flex items-center wrap">
                              <b class="text-positive">{{ formatAnswer(input.answer.answer.split('|')) }}</b>
                            </div>
                          </div>
                        </q-card-section>
                      </q-card>
                    </q-dialog>
                  </div>
                  <div v-else>
                    <q-chip v-for="text in input.value.array" :key="`${text}`"
                      :class="`q-lesson-field-value text-center rounded-xs bg-white ${(input.value.text == '' || input.value.text == false) ? 'disabled': ''}`"
                      style="pointer-events: none; font-size: inherit">
                      <b>{{ text }}</b>
                    </q-chip>
                  </div>
                </div>
              </q-item-section>
              <q-item-section side v-if="!input.answer">
                <q-spinner v-if="buttonIsLoading" class="q-mr-sm" color="primary" size="2em"/>
                <q-icon v-else class="q-mr-sm cursor-pointer" round  push
                  :color="(input.value.text == '' || input.value.text == false) ? 'grey-6' : 'primary'" name="send"
                  @click="(input.value.text == '' || input.value.text == false) ? '' : saveAnswer()" />
              </q-item-section>
            </div>
        </Teleport>
    </div>
    <div v-if="currentIndex !== null">
      <q-card v-if="!formData.fields[currentIndex].answer" flat class="text-dark" @mousedown.prevent="matchStart(currentIndex)">
        <q-card-section class="q-pt-none">
          <div class="flex justify-center wrap">
            <div v-for="(option, optionIndex) in formData.fields[currentIndex].options" :key="optionIndex">
              <q-chip class="q-lesson-field-value bg-white rounded-xs" size="16px" :clickable="!variantsDisabled" @click.stop="selectVariant(option.text, optionIndex)"
              :color="(option.count > 0) ? 'orange' : 'white'"
              :text-color="(option.count > 0) ? 'white' : ''"
              >
                <b>{{ option.text }}</b>
              </q-chip>
            </div>
            <div :style="(currentValue.length > 0) ? '' : 'pointer-events: none'">
              <q-chip class="q-lesson-field-value rounded-sm" size="16px" :clickable="!clearDisabled" @click.stop="clearVariant()" :color="(currentValue.length == 0) ? 'red-5' : 'negative'" text-color="white">
                <q-icon name="keyboard_backspace"></q-icon>
              </q-chip>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, ref } from 'vue'
import { useLesson } from '../../../composables/useLesson'

const emits = defineEmits(['update-answer', 'onAnswerSaved'])
const { lesson } = useLesson()

const currentIndex = ref(null)
const currentValue = ref('')
const currentValueArray = ref([])
const clearDisabled = ref(false)
const variantsDisabled = ref(false)
const buttonIsLoading = ref(false)

const formData = reactive({
  fields: []
})
const renderFields = () => {
  formData.fields = []
  if (!lesson.active.page?.fields) return
  for (const k in lesson.active.page.fields) {
    const field = lesson.active.page.fields[k]
    let value = {
      text: '',
      array: []
    }
    let options = field.variants
    if (field.answer) {
      value.text = field.answer.value
      value.array = field.answer.value.split('|')
      value.textFormatted = formatAnswer(value.array)
      value.is_finished = true
    }
    formData.fields.push({ value, options, index: field.index, answer: field.answer })
  }
  emits('update-answer', formData.fields)
}
const matchEnd = (evt) => {
  if(evt.explicitOriginalTarget.nodeName == '#text' || !evt.explicitOriginalTarget.closest(".q-field")) {
    currentIndex.value = null;
    currentValue.value = '';
    currentValueArray.value = [];
  }
}
const matchStart = (index) => {
  if(index === null) return
  currentIndex.value = index
  currentValue.value = formData.fields[currentIndex.value].value.text
  currentValueArray.value = formData.fields[currentIndex.value].value.array
}
const selectVariant = (text, variantIndex) => {
  if(variantsDisabled.value) return
  if(formData.fields[currentIndex.value].options[variantIndex].count > 0) return clearVariant(text)
  currentValueArray.value.push(text)
  currentValue.value = currentValueArray.value.join('|')
  formData.fields[currentIndex.value].value.text = currentValue.value
  formData.fields[currentIndex.value].value.array = currentValueArray.value
  addVariantCount(variantIndex)
  setVariantsDebounce()
}

const clearVariant = (text = null) => {
  if(clearDisabled.value) return
  if(text){
    currentValueArray.value = removeVariantFromArray(text)
  } else {
    text = currentValueArray.value.pop()
  }
  currentValue.value = currentValueArray.value.join('|')
  formData.fields[currentIndex.value].value.text = currentValue.value
  formData.fields[currentIndex.value].value.array = currentValueArray.value
  substactVariantCount(text)
  setClearDebounce()
}

const saveAnswer = function (e) {
  currentIndex.value = null
  currentValue.value = ''
  currentValueArray.value = []
  buttonIsLoading.value = true
  setTimeout(() => {
    emits('onAnswerSaved')
    buttonIsLoading.value = false
  }, 500)

}

const removeVariantFromArray = (text) => {
  var newArray = []
    for(var i = currentValueArray.value.length-1; i >= 0; i--){
      if(currentValueArray.value[i] !== text) newArray.unshift(currentValueArray.value[i])
    }
    return newArray
}

const addVariantCount = (variantIndex) => {
  if(!formData.fields[currentIndex.value].options[variantIndex].count) formData.fields[currentIndex.value].options[variantIndex].count = 0
  formData.fields[currentIndex.value].options[variantIndex].count++
}
const substactVariantCount = (text) => {
  const variantIndex = formData.fields[currentIndex.value].options.findIndex((variant) => variant.text == text && variant.count > 0)
  formData.fields[currentIndex.value].options[variantIndex].count--
}
const setClearDebounce = () => {
  clearDisabled.value = true
  setTimeout(() => {clearDisabled.value = false}, 100)
}
const setVariantsDebounce = () => {
  variantsDisabled.value = true
  setTimeout(() => {variantsDisabled.value = false}, 100)
}
const formatAnswer = (arrayAnswer) => {
  const result = [];
  for(var i in arrayAnswer){
    if(arrayAnswer[i].match(/[,.!?]/)){
      result.push(arrayAnswer[i])
    } else {
      result.push(' '+arrayAnswer[i])
    }
  }
  return result.join('').trim()
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
  min-height: 4em !important;
  margin: 0;
  &.q-active:not(.is-answered){
    .chip-container{
      padding: 8px 0;
    }
  }
  &.is-correct{
    box-shadow: none;
    background: none !important;
    padding: 0;
    min-height: auto !important;
    .q-lesson-field-value-flat{
      color: $positive !important;
    }
  }
  &.is-incorrect{
    box-shadow: none;
    background: none !important;
    padding: 0;
    min-height: auto !important;
    .q-lesson-field-value-flat{
      color: $negative !important;
    }
  }
  .q-lesson-field-value{
    min-width: 25px;
    margin: 2px;
  }
}
</style>
