<template>
  <div v-if="formData.fields.length > 0">
        <div v-for="(input, index) in formData.fields" :key="index">
            <Teleport :to="`\#input_${input.index}`">
                <div class="row justify-between ">
                  <div class="col-6 q-pa-xs" v-for="(image, imageIndex) in formData.fields[index].options" :key="imageIndex">
                    <q-card v-if="!formData.fields[index].answer"
                      :class="`q-lesson-radio rounded-sm ${(formData.fields[index].value.text == image.text) ?  'q-active' : ''} `"
                      @click="formData.fields[index].value.text = image.text; playAudio(image.audio_link)">
                      <q-card-section class="q-pa-sm ">
                        <q-img
                          v-if="image.image"
                          :ratio="1"
                          :data-audio="image.audio_link"
                          class="rounded-sm play-audio"
                          :src="`${CONFIG.API_HOST}/${image.image}`"
                        />
                      </q-card-section>
                      <q-card-section class="text-center q-pt-sm text-subtitle1 ">
                        <b>{{ transliterateHTML(image.text) }}</b>
                      </q-card-section>
                    </q-card>
                    <q-card v-else :class="`q-lesson-radio rounded-sm ${(formData.fields[index].answer.answer == image.text) ? 'is-correct' : (formData.fields[index].answer.value == image.text) ? 'is-incorrect' : ''}`">
                        <q-card-section class="q-pa-sm">
                          <q-img
                            v-if="image.image"
                            :ratio="1"
                            :data-audio="image.audio_link"
                            class="rounded-sm"
                            :src="`${CONFIG.API_HOST}/${image.image}`"
                          />
                        </q-card-section>
                        <q-card-section class="text-center q-pt-sm text-subtitle1">
                          <q-icon v-if="formData.fields[index].answer.value == image.text" class="q-mr-sm " name="check" size="20px"></q-icon>
                          <b class="vertical-middle">{{ transliterateHTML(image.text) }}</b>
                        </q-card-section>
                    </q-card>
                  </div>
                </div>
            </Teleport>
        </div>
  </div>
</template>

<script setup>
import { reactive, watch, onMounted } from 'vue'
import { useLesson } from '../../../composables/useLesson'
import { useLessonAudio } from '../../../composables/useLessonAudio'
import { useTransliterate } from '../../../composables/useTransliterate'
import { CONFIG } from '../../../config.js'

const emits = defineEmits(['update-answer', 'onAnswerSaved'])

const { lesson } = useLesson()
const { playAudio, loadAudio } = useLessonAudio()
const { transliterateHTML } = useTransliterate()

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
    const options = field.variants
    if (field.answer) {
      value.text = field.answer.value
    }
    formData.fields.push({ value, options, index: field.index, answer: field.answer, label: field.label })
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

onMounted(() => {
  loadAudio()
})
</script>

<style scoped lang="scss">

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
  }
  &.is-incorrect{
    background: $negative !important;
    color: white !important;
  }
}
</style>
