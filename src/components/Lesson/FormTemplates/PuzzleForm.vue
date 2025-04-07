<template>
  <div v-if="formData.fields.length > 0">
    <div v-for="(input, index) in formData.fields" :key="index">
        <Teleport :to="`\#input_${input.index}`">
          <div
            tabindex="-1"
            @focus="matchStart(index)"
            @blur="matchEnd"
            :class="`q-lesson-field bg-grey-2 q-pa-xs ${(index == currentIndex) ? 'q-active' : ''} ${(formData.fields[index].answer) ? ((formData.fields[index].answer.is_correct) ? 'is-correct' : 'is-incorrect') : ''}`"
          >
              <q-chip :class="`q-lesson-field-value text-center rounded-xs bg-white ${(input.value.text == '' || input.value.text == false) ? 'disabled': ''}`"
                v-for="text in input.value.array" :key="`${text}`"
                style="pointer-events: none; font-size: inherit">
                <b>{{ text }}</b>
              </q-chip>
          </div>
        </Teleport>
    </div>
    <div v-if="currentIndex !== null">
      <q-card v-if="!formData.fields[currentIndex].answer" flat class="text-dark" @mousedown.prevent="matchStart(currentIndex)">
        <q-card-section>
          <div class="flex justify-center wrap">
            <div v-for="(option, optionIndex) in formData.fields[currentIndex].options" :key="optionIndex">
              <q-chip class="q-lesson-field-value bg-white rounded-xs" size="20px" :clickable="!variantsDisabled" @click.stop="selectVariant(option.text, optionIndex)"
              :color="(option.count > 0) ? 'orange' : 'white'"
              :text-color="(option.count > 0) ? 'white' : ''"
              >
                <b>{{ option.text }}</b>
              </q-chip>
            </div>
            <div :style="(currentValue.length > 0) ? '' : 'pointer-events: none'">
              <q-chip class="q-lesson-field-value rounded-sm" size="20px" :clickable="!clearDisabled" @click.stop="clearVariant()" :color="(currentValue.length == 0) ? 'red-5' : 'negative'" text-color="white">
                <q-icon name="keyboard_backspace"></q-icon>
              </q-chip>
            </div>
          </div>
        </q-card-section>
      </q-card>
      <q-card v-else flat class="text-dark" @mousedown.prevent="matchStart(currentIndex)">
        <q-card-section>
          <div class="flex justify-center wrap">
            <div v-for="(option, optionIndex) in formData.fields[currentIndex].answer.answer.split('|')" :key="optionIndex">
              <q-chip class="q-lesson-field-value rounded-xs" size="20px"
                color="positive"
                text-color="white">
                <b>{{ option }}</b>
              </q-chip>
            </div>
          </div>
          <div class="flex justify-center wrap" v-if="!formData.fields[currentIndex].answer.is_correct">
            <div v-for="(option, optionIndex) in formData.fields[currentIndex].answer.value.split('|')" :key="optionIndex">
              <q-chip class="q-lesson-field-value rounded-xs" size="20px"
                color="negative"
                text-color="white">
                <b>{{ option }}</b>
              </q-chip>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <q-card v-else-if="!lesson.active.page?.answer?.is_finished" flat class="text-dark">
      <q-card-section class="text-center">
        <div class="text-h6">Выберите поле</div>
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
    } else {
      if(currentIndex.value == null) currentIndex.value = k
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
<style  lang="scss">
.q-lesson-field {
  display: inline-block;
  vertical-align: middle;
  overflow: hidden;
  margin: 0 5px;
  min-width: 40px;
  border-radius: 11px;
  transition: 0.3s all ease;
  box-shadow: inset 0px 0px 0px 2px rgba(0, 0, 0, 0.15);
  font-weight: initial;
  min-height: 3em;
  &.q-active{
    background: $grey-4 !important;
    box-shadow: inset 0px 0px 0px 2px rgba(25, 118, 210, 0.5);
    .q-lesson-field-value{
      background: $orange !important;
      color: white !important;
    }
  }
  &.is-correct{
    box-shadow: inset 0px 0px 0px 2px rgba(25, 210, 65, 0.5);
    background: $green-3 !important;
    &.q-active .q-lesson-field-value{
      background: $green-7 !important;
      color: white !important;
    }
    .q-lesson-field-value{
      background: $positive !important;
      color: white !important;
    }
  }
  &.is-incorrect{
    box-shadow: inset 0px 0px 0px 2px rgba(210, 25, 25, 0.5);
    background: $red-3 !important;
    &.q-active .q-lesson-field-value{
      background: $red-7 !important;
      color: white !important;
    }
    .q-lesson-field-value{
      background: $negative !important;
      color: white !important;
    }
  }

  .q-lesson-field-value{
    height: auto;
  }
}
.q-lesson-field-value{
  border-radius: 9px;
  box-shadow: inset 0px 0px 0px 2px rgba(0, 0, 0, 0.15);
  border-bottom: 3px solid rgba(0, 0, 0, 0.15);
  &.disabled {
    opacity: 0 !important;
  }
  .q-chip__content{
    justify-content: center;
  }
}
</style>
