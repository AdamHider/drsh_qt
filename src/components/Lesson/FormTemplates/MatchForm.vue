<template>
    <div v-if="formData.fields.length > 0">
        <div v-for="(field, index) in formData.fields" :key="index">
            <Teleport :to="`\#input_${field.index}`">
                <q-select
                    dense
                    hide-dropdown-icon
                    v-model="formData.fields[index].value"
                    :options="formData.fields[index].options"
                    :color="(formData.fields[index].answer) ? ((formData.fields[index].answer.is_correct == 'correct') ? 'green' : 'negative') : 'primary'"
                    :style="{ display: 'inline-block', minWidth: '50px', height: '18px', justifyContent: 'center', verticalAlign: 'bottom'  }"
                    behavior="menu"
                    :class="`q-select-inline ${(formData.fields[index].answer) ? ((formData.fields[index].answer.is_correct == 'correct') ? 'correct-answer' : 'wrong-answer') : ''}`"
                    :ref="el => { fieldsRefs[index] = el }"
                    @popup-show="matchStart(index)"
                >
                  <template v-slot:no-option v-if="lesson.active.page?.data.match_variants">
                    <q-page-sticky v-if="matchMode" class="q-mb-md" expand position="bottom" >
                      <q-card style="width: 350px">
                        <q-card-section>
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
                          </q-card-section>
                      </q-card>
                    </q-page-sticky>
                  </template>
                  <template v-slot:no-option v-if="formData.fields[index].answer">
                        <q-item>
                            <q-item-section>
                                <q-item-label v-if="formData.fields[index].value !== ''">
                                    Your answer:
                                    <b :class="`text-${(formData.fields[index].answer.is_correct == 'correct') ? 'positive' : 'negative'}`">
                                        {{ formData.fields[index].value }}
                                    </b>
                                </q-item-label>
                                <q-item-label v-else>
                                    <b class="text-negative">Empty answer</b>
                                </q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item v-if="formData.fields[index].answer.is_correct == 'wrong'" class="q-pt-none">
                            <q-item-section>
                                <q-item-label>Correct answer: <b  class="text-positive">{{ formData.fields[index].answer.correct_answer }}</b></q-item-label>
                            </q-item-section>
                        </q-item>
                    </template>
                </q-select>
            </Teleport>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch, defineEmits } from 'vue'
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
    let value = ''
    let options = []
    if (field.answer) {
      if (field.answer.is_correct === 'wrong') {
        value = field.answer.wrong_answer
        options = []
      } else {
        value = field.answer.correct_answer
        options = []
      }
    }
    formData.fields.push({ value, options, index: field.index, answer: field.answer })
  }
  emits('update-answer', formData.fields)
}

const matchEnd = (variantIndex) => {
  const prevVariantIndex = lesson.active.page.data.match_variants.findIndex(variant => variant.answer === formData.fields[currentIndex.value].value)
  if (lesson.active.page.data.match_variants[prevVariantIndex]) lesson.active.page.data.match_variants[prevVariantIndex].selected = false
  if (lesson.active.page.data.match_variants[variantIndex].selected) {
    if (lesson.active.page.data.match_variants[variantIndex].selectedTarget == currentIndex.value) {
      lesson.active.page.data.match_variants[variantIndex].selected = false
      formData.fields[currentIndex.value].value = ''
      return
    }
    formData.fields[lesson.active.page.data.match_variants[variantIndex].selectedTarget].value = ''
  }
  lesson.active.page.data.match_variants[variantIndex].selected = true
  lesson.active.page.data.match_variants[variantIndex].selectedTarget = currentIndex.value
  formData.fields[currentIndex.value].value = lesson.active.page?.data.match_variants[variantIndex].answer
}

const matchStart = (fieldIndex) => {
  if (lesson.active.page.answers.is_finished) return
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
