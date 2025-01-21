<template>
    <div v-if="formData.fields.length > 0">
        <div v-for="(field, index) in formData.fields" :key="index">
            <Teleport :to="`\#input_${field.index}`">
                <q-field
                    dense
                    hide-dropdown-icon
                    v-model="formData.fields[index].value.text"
                    :color="(formData.fields[index].answer) ? ((formData.fields[index].answer.is_correct ) ? 'green' : 'negative') : 'primary'"
                    :class="`q-select-inline ${(formData.fields[index].answer) ? ((formData.fields[index].answer.is_correct ) ? 'correct-answer' : 'wrong-answer') : ''}`"
                    :ref="el => { fieldsRefs[index] = el }"
                    @focus="matchStart(index)"
                    @blur="matchEnd(false)"
                >

                  <template v-slot:control>
                      <b>{{ formData.fields[index].value.text }}</b>
                  </template>
                  <template v-slot:no-option v-if="formData.fields[index].answer">
                        <q-item>
                            <q-item-section>
                                <q-item-label v-if="formData.fields[index].value.text !== ''">
                                    Your answer:
                                    <b :class="`text-${(formData.fields[index].answer.is_correct ) ? 'positive' : 'negative'}`">
                                        {{ formData.fields[index].value.text }}
                                    </b>
                                </q-item-label>
                                <q-item-label v-else>
                                    <b class="text-negative">Empty answer</b>
                                </q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item v-if="!formData.fields[index].answer.is_correct" class="q-pt-none">
                            <q-item-section>
                                <q-item-label>Correct answer: <b  class="text-positive">{{ formData.fields[index].answer.answer }}</b></q-item-label>
                            </q-item-section>
                        </q-item>
                    </template>
                </q-field>
            </Teleport>
        </div>
        <q-page-sticky position="bottom" :offset="[0, 18]">
          <q-chip v-for="(field, index) in lesson.active.page?.data.match_variants" :key="index"
            @click="matchEnd(index)"
            clickable
            :color="field.selected ? 'positive' : 'primary'"
            text-color="white"
          >
            <span v-if="field.image" class="ui label large quiz-input-variant anim anim-fadeInFromRight" :data-value="field.answer" :data-key="index+1">
              <h4>{{ index+1 }}</h4>
              <img :src="`images/${field.image}`" />
            </span>
            <span v-else class="ui label large quiz-input-variant wrtmode-true" :data-variant_index="index" :data-value="field.answer">
              {{ field.answer }}
            </span>
          </q-chip>
        </q-page-sticky>
    </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useLesson } from '../../../composables/useLesson'

const emits = defineEmits(['update-answer', 'onAnswerSaved'])
const { lesson } = useLesson()
const currentIndex = ref(0)
const matchMode = ref(false)
const fieldsRefs = ref([])

const formData = reactive({
  fields: []
})
const renderFields = () => {
  formData.fields = []
  if (!lesson.active.page.fields) return
  for (const k in lesson.active.page.fields) {
    const field = lesson.active.page.fields[k]
    let value = {
      text: ''
    }
    let options = []
    if (field.answer) {
      value.text = field.answer.value
      options = []
    }
    formData.fields.push({ value, options, index: field.index, answer: field.answer })
  }
  emits('update-answer', formData.fields)
}

const matchEnd = (variantIndex) => {
  if(!currentIndex.value) return false
  if (variantIndex === false) {
    fieldsRefs.value[currentIndex.value].blur()
    return
  }
  const prevVariantIndex = lesson.active.page.data.match_variants.findIndex(variant => variant.answer === formData.fields[currentIndex.value].value.text)
  if (lesson.active.page.data.match_variants[prevVariantIndex]) lesson.active.page.data.match_variants[prevVariantIndex].selected = false
  if (lesson.active.page.data.match_variants[variantIndex].selected) {
    if (lesson.active.page.data.match_variants[variantIndex].selectedTarget == currentIndex.value) {
      lesson.active.page.data.match_variants[variantIndex].selected = false
      formData.fields[currentIndex.value].value.text = ''
      return
    }
    formData.fields[lesson.active.page.data.match_variants[variantIndex].selectedTarget].value.text = ''
  }
  lesson.active.page.data.match_variants[variantIndex].selected = true
  lesson.active.page.data.match_variants[variantIndex].selectedTarget = currentIndex.value
  fieldsRefs.value[currentIndex.value].hidePopup()
  formData.fields[currentIndex.value].value.text = lesson.active.page?.data.match_variants[variantIndex].answer
  currentIndex.value = false
}

const matchStart = (fieldIndex) => {
  if (lesson.active.page.answers) return
  matchMode.value = true
  currentIndex.value = fieldIndex
}

renderFields()

watch(() => lesson.active.page, (newValue, oldValue) => {
  renderFields()
})

watch(formData.fields, (newValue, oldValue) => {
  emits('update-answer', formData.fields)
})
</script>
