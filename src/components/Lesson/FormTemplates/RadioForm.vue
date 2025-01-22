<template>
  <div v-if="formData.fields.length > 0">
        <div v-for="(input, index) in formData.fields" :key="index">
            <Teleport :to="`\#input_${input.index}`">
              <div v-if="input.mode == 'match'">
                <q-list v-if="!formData.fields[index].answer">
                  <q-item v-for="(variant, variantIndex) in formData.fields[index].options" :key="variantIndex"
                   tag="label" :class="`q-lesson-radio q-mb-sm rounded-sm ${(formData.fields[index].value.text == variant.text) ? 'q-active' : ''}`"
                  >
                    <q-item-section avatar>
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
                <q-list v-else>
                  <q-item tag="label" v-for="(variant, variantIndex) in formData.fields[index].options" :key="variantIndex" v-ripple
                    :class="`${(formData.fields[index].answer.answer == variant.text) ? 'text-positive' : (formData.fields[index].answer.value == variant.text) ? 'text-negative' : ''}`">
                    <q-item-section avatar>
                      <q-icon :name="(formData.fields[index].answer.value == variant.text) ? 'check' : 'radio_button_unchecked'"></q-icon>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ variant.text }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
              <div  v-else-if="input.mode == 'variant'">
                <div v-if="!formData.fields[index].answer" class="q-gutter-sm q-my-sm">
                  <q-radio  v-for="(variant, variantIndex) in formData.fields[index].options" :key="variantIndex"
                    dense
                    v-model="formData.fields[index].value.text"
                    :val="variant.text"
                    :label="variant.text" />
                </div>
                <div v-else>
                <q-chip   v-for="(variant, variantIndex) in formData.fields[index].options" :key="variantIndex"
                    size="14px"
                    dense
                    :icon="`${(formData.fields[index].answer.value == variant.text) ? 'check' : 'radio_button_unchecked'}`"
                    color="transparent"
                    :text-color="`${(formData.fields[index].answer.answer == variant.text) ? 'positive' : (formData.fields[index].answer.value == variant.text) ? 'negative' : ''}`"
                  >
                    <span >{{ variant.text }}</span>
                  </q-chip>
                </div>
              </div>
            </Teleport>
        </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { useLesson } from '../../../composables/useLesson'

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
  console.log(formData.fields)
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
<style scoped lang="scss">
.q-lesson-radio{
  box-shadow: inset 0px 0px 0px 2px rgba(0, 0, 0, 0.15);
  border-bottom: 3px solid rgba(0, 0, 0, 0.15);

  &.q-active{
    background: $primary !important;
    color: white !important;
  }
}
</style>
