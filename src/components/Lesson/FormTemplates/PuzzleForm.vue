<template>
  <div v-if="formData.fields.length > 0">
    <div v-for="(input, index) in formData.fields" :key="index">
        <Teleport :to="`\#input_${input.index}`">
          <div
            tabindex="-1"
            @focus="matchStart(index)"
            @blur="matchEnd"
            :class="`q-lesson-field bg-grey-3 q-pa-sm ${(index == currentIndex) ? 'q-active' : (input.value.text == '' || input.value.text == false) ? 'is-inactive' : ''} ${(input.answer) ? ((input.answer.is_correct) ? 'is-answered is-correct' : 'is-answered is-incorrect') : ''}`"
            :style="`min-width: ${input.width}px`"
          >
              <q-chip v-for="text in input.value.array" :key="`${text}`"
                :class="`q-lesson-field-value text-center rounded-xs bg-white ${(input.value.text == '' || input.value.text == false) ? 'disabled': ''}`"
                style="pointer-events: none; font-size: inherit">
                <b>{{ text }}</b>
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
    <div v-if="currentIndex !== null && !formData.fields[currentIndex].answer">
      <q-card flat class="text-dark" @mousedown.prevent="matchStart(currentIndex)">
        <q-card-section>
          <div class="flex justify-center wrap">
            <div v-for="(option, optionIndex) in formData.fields[currentIndex].options" :key="optionIndex">
              <q-chip class="q-lesson-field-value bg-white rounded-xs" size="18px" :clickable="!variantsDisabled" @click.stop="selectVariant(option.text, optionIndex)"
              :color="(option.count > 0) ? 'orange' : 'white'"
              :text-color="(option.count > 0) ? 'white' : ''"
              >
                <b>{{ option.text }}</b>
              </q-chip>
            </div>
            <div :style="(currentValue.length > 0) ? '' : 'pointer-events: none'">
              <q-chip class="q-lesson-field-value rounded-sm" size="18px" :clickable="!clearDisabled" @click.stop="clearVariant()" :color="(currentValue.length == 0) ? 'red-5' : 'negative'" text-color="white">
                <q-icon name="keyboard_backspace"></q-icon>
              </q-chip>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <q-card v-else-if="!lesson.active.page?.answer?.is_finished" flat class="text-dark">
      <q-card-section class="text-center">
        <div class="text-h6"><b>Выберите поле</b></div>
        <div class="text-subtitle2">И здесь появятся варианты ответа</div>
      </q-card-section>
    </q-card>
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
      value.is_finished = true
    }
    field.width = calculateWidth(field)
    formData.fields.push({ value, options, index: field.index, answer: field.answer, width: field.width })
  }
  emits('update-answer', formData.fields)
}
const calculateWidth = (field) => {
  let length = 0;
  for(var i in field.variants){
    length += field.variants[i].text.length
  }
  if(length*12 > 200) return 200
  return length*12;
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
  vertical-align: middle;
  display: inline-block;
  min-width: 60px;
  min-height: 2.3em;
  &.is-answered{
  }
  &.q-active{
    border-color: $primary;
  }
  .q-lesson-field-value{
    margin: 2px;
  }
}
</style>
