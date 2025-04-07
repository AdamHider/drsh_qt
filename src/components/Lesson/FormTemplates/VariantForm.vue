<template>
  <div v-if="formData.fields.length > 0">
    <div v-for="(input, index) in formData.fields" :key="index">
        <Teleport :to="`\#input_${input.index}`">
          <div
            tabindex="-1"
            @focus="matchStart(index)"
            @blur="matchEnd"
            :class="`q-lesson-field bg-grey-2 ${(index == currentIndex) ? 'q-active' : ''} ${(formData.fields[index].answer) ? ((formData.fields[index].answer.is_correct) ? 'is-correct' : 'is-incorrect') : ''}`"
          >
            <q-chip
              :class="`q-lesson-field-value full-width text-center q-ma-none bg-white rounded-xs ${(input.value.text == '' || input.value.text == false) ? 'disabled': ''}`"
              style="pointer-events: none; font-size: inherit;" >
              <b v-if="input.value.text">{{ input.value.text }}</b>
              <b v-else>_</b>
            </q-chip>
          </div>
        </Teleport>
    </div>
    <div v-if="currentIndex !== null">
      <q-card v-if="!formData.fields[currentIndex].answer" flat class="text-dark" @mousedown.prevent="matchStart(currentIndex)">
          <q-card-section>
            <div class="flex justify-center wrap">
              <div v-for="(option, optionIndex) in formData.fields[currentIndex].options" :key="optionIndex">
                <q-chip v-if="option.text !== formData.fields[currentIndex].value.text" class="q-lesson-field-value bg-white rounded-xs" size="18px" color="white" clickable @click.stop="selectVariant(option.text)">
                  <b>{{ option.text }}</b>
                </q-chip>
                <q-chip v-else class="q-lesson-field-value rounded-sm" size="18px" clickable @click.stop="clearVariant()" color="secondary" text-color="white">
                  <b>{{ option.text }}</b>
                </q-chip>
              </div>
            </div>
          </q-card-section>
      </q-card>
      <q-card v-else flat class="text-dark" @mousedown.prevent="matchStart(currentIndex)">
        <q-card-section>
          <div class="flex justify-center wrap">
            <div v-for="(option, optionIndex) in formData.fields[currentIndex].options" :key="optionIndex">
              <q-chip v-if="option.text !== formData.fields[currentIndex].value.text" class="q-lesson-field-value rounded-xs" size="18px"
                :color="(formData.fields[currentIndex].answer.answer == option.text) ? 'positive' : 'white'"
                :text-color="(formData.fields[currentIndex].answer.answer == option.text) ? 'white' : 'dark'">
                <b>{{ option.text }}</b>
              </q-chip>
              <q-chip v-else class="q-lesson-field-value rounded-sm" size="18px" icon="done"
                :color="(formData.fields[currentIndex].answer.answer == option.text) ? 'positive' : 'negative'"
                text-color="white">
                <b>{{ option.text }}</b>
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
const selectMode = ref(false)

const formData = reactive({
  fields: []
})
const renderFields = () => {
  formData.fields = []
  if (!lesson.active.page?.fields) return
  for (const k in lesson.active.page.fields) {
    const field = lesson.active.page.fields[k]
    let value = {
      text: ''
    }
    let options = field.variants
    if (field.answer) {
      value.text = field.answer.value
      value.is_finished = true
    }
    formData.fields.push({ value, options, index: field.index, answer: field.answer })
  }
  emits('update-answer', formData.fields)
}
const matchEnd = (evt) => {
  if(evt.explicitOriginalTarget.nodeName == '#text' || !evt.explicitOriginalTarget.closest(".q-field")) currentIndex.value = null;
}
const matchStart = (index) => {
  currentIndex.value = index
}
const selectVariant = (text) => {
  formData.fields[currentIndex.value].value.text = text
}
const clearVariant = (text) => {
  formData.fields[currentIndex.value].value.text = ''
}

renderFields()

watch(() => lesson.active.page, (newValue, oldValue) => {
  renderFields()
})

watch(formData.fields, (newValue, oldValue) => {
  emits('update-answer', formData.fields)
})
</script>
<style lang="scss">
.q-lesson-field {
  display: inline-block;
  vertical-align: middle;
  overflow: hidden;
  margin: 0 5px;
  min-width: 35px;
  border-radius: 11px;
  transition: 0.3s all ease;
  box-shadow: inset 0px 0px 0px 2px rgba(0, 0, 0, 0.15);
  font-weight: initial;
  &.q-active{
    background: $grey-4 !important;
    box-shadow: inset 0px 0px 0px 2px rgba(25, 118, 210, 0.5);
    .q-lesson-field-value{
      background: $secondary !important;
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
    padding: 0.8em 0.6em;
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
