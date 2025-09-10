<template>
  <div v-if="formData.fields.length > 0">
        <div v-for="(input, index) in formData.fields" :key="index">
            <Teleport :to="`\#input_${input.index}`">
              <div v-if="input.mode == 'match'">
                <q-list v-if="!formData.fields[index].answer">
                  <q-item v-for="(variant, variantIndex) in formData.fields[index].options" :key="variantIndex" @click.stop="playAudio('click_tiny')"
                   tag="label" :class="`q-lesson-radio q-mb-sm rounded-sm ${(formData.fields[index].value.text == variant.text) ? 'q-active' : ''}`"
                  >
                    <q-item-section side>
                      <q-radio
                        dense
                        v-model="formData.fields[index].value.text"
                        :color="`${(formData.fields[index].value.text == variant.text) ? 'white' : ''}`"
                        :val="variant.text"/>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label><b>{{ variant.text }}</b></q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
                <q-list v-else  >
                  <q-item tag="label"  v-for="(variant, variantIndex) in formData.fields[index].options" :key="variantIndex" v-ripple
                    :class="`q-lesson-radio q-mb-sm rounded-sm ${(formData.fields[index].answer.answer == variant.text) ? 'is-correct' : (formData.fields[index].answer.value == variant.text) ? 'is-incorrect' : ''}`">
                    <q-item-section side>
                      <q-icon :name="(formData.fields[index].answer.value == variant.text) ? 'check' : 'radio_button_unchecked'" size="20px" :color="(formData.fields[index].answer.answer !== variant.text) ? 'gray' : 'white'"></q-icon>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label><b>{{ variant.text }}</b></q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
              <div  v-else-if="input.mode == 'variant'">
                <div v-if="!formData.fields[index].answer" class="flex q-gutter-xs">
                  <div v-for="(variant, variantIndex) in formData.fields[index].options" :key="variantIndex"
                    :class="`q-lesson-radio q-px-sm q-py-xs q-mb-sm rounded-sm ${(formData.fields[index].value.text == variant.text) ? 'q-active' : ''}`"
                    >
                    <q-radio
                      dense
                      v-model="formData.fields[index].value.text"
                      :color="`${(formData.fields[index].value.text == variant.text) ? 'white' : ''}`"
                      :val="variant.text"
                      class="text-bold"
                      :label="variant.text" />
                  </div>
                </div>
                <div v-else  class="flex q-gutter-xs ">
                  <div v-for="(variant, variantIndex) in formData.fields[index].options" :key="variantIndex"
                    :class="`q-lesson-radio q-px-sm q-py-xs q-mb-sm rounded-sm ${(formData.fields[index].answer.answer == variant.text) ? 'is-correct' : (formData.fields[index].answer.value == variant.text) ? 'is-incorrect' : ''}`"
                    >
                    <q-radio
                      style="pointer-events: none"
                      dense
                      v-model="formData.fields[index].value.text"
                      :color="`${(formData.fields[index].answer.answer == variant.text) ? 'white' : ((formData.fields[index].answer.value == variant.text) ? 'white' : 'white')}`"
                      :val="variant.text"
                      class="text-bold"
                      :label="variant.text" />
                  </div>
                </div>
              </div>
            </Teleport>
        </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { useLesson } from '../../../composables/useLesson'
import { useAudio } from '../../../composables/useAudio'

const { playAudio } = useAudio()

const emits = defineEmits(['update-answer', 'onAnswerSaved'])
const { lesson } = useLesson()

const formData = reactive({
  fields: []
})
const renderFields = () => {
  formData.fields = []
  if (!lesson.active.page.fields) return
  for (const k in lesson.active.page.fields) {
    const field = lesson.active.page.fields[k]
    let value = {
      text: false
    }
    let options = field.variants
    if (field.answer) {
      value.text = field.answer.value
    }
    formData.fields.push({ value, options, mode: field.mode, index: field.index, answer: field.answer, label: field.label })
  }
  emits('update-answer', formData.fields)
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
.q-lesson-radio{
  box-shadow: inset 0px 0px 0px 2px rgba(0, 0, 0, 0.15);
  border-bottom: 3px solid rgba(0, 0, 0, 0.15);
  font-weight: initial;

  &.q-active{
    background: $primary !important;
    color: white !important;
  }
  &.is-correct{
    background: $positive !important;
    color: white !important;
    .q-radio__inner{
      color: white !important;
    }
  }
  &.is-incorrect{
    background: $negative !important;
    color: white !important;
    .q-radio__inner{
      color: white !important;
    }
  }
}
</style>
