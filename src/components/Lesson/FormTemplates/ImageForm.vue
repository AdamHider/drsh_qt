<template>
  <div v-if="formData.fields.length > 0">
        <div v-for="(input, index) in formData.fields" :key="index">
            <Teleport :to="`\#input_${input.index}`">
                <div class="row justify-between  full-width">
                  <div class="col-6 q-pa-sm " v-for="(image, imageIndex) in formData.fields[index].options" :key="imageIndex">
                    <q-card v-if="!formData.fields[index].answer"
                      :class="`${(formData.fields[index].value == image.text) ?  'bg-positive text-white' : ''} `"
                      @click="formData.fields[index].value = image.text; playAudio(image.audio_link)">
                        <q-card-section class="q-pa-sm ">
                          <q-img
                            v-if="image.image"
                            :data-audio="image.audio_link"
                            class="rounded-borders play-audio"
                            :src="`${CONFIG.API_HOST}/${image.image}`"
                          />
                        </q-card-section>
                        <q-card-section vertical class="flex flex-center text-center">
                          <b>{{ image.text }}</b>
                        </q-card-section>
                    </q-card>
                    <q-card v-else
                      :class="`${(formData.fields[index].answer.answer == image.text || (formData.fields[index].answer.value == image.text && formData.fields[index].answer.is_correct))  ?  'bg-positive text-white' : ((formData.fields[index].answer.value == image.text ) ?  'bg-negative text-white' : '')  }`">
                        <q-card-section class="q-pa-sm ">
                          <q-img
                            v-if="image.image"
                            :data-audio="image.audio_link"
                            class="rounded-borders"
                            :src="`${CONFIG.API_HOST}/${image.image}`"
                          />
                        </q-card-section>
                        <q-card-section vertical class="flex flex-center text-center">
                          <b>{{ image.text }}</b>
                        </q-card-section>
                    </q-card>
                  </div>
                </div>
            </Teleport>
        </div>
  </div>
</template>

<script setup>
import { reactive, watch, defineEmits, onMounted } from 'vue'
import { useLesson } from '../../../composables/useLesson'
import { useLessonAudio } from '../../../composables/useLessonAudio'
import { CONFIG } from '../../../config.js'

const emits = defineEmits(['update-answer', 'onAnswerSaved'])

const { lesson } = useLesson()
const { playAudio, loadAudio } = useLessonAudio()

const formData = reactive({
  fields: []
})
const renderFields = () => {
  formData.fields = []
  if (!lesson.active.page.fields) return
  for (const k in lesson.active.page.fields) {
    const field = lesson.active.page.fields[k]
    let value
    const options = field.variants
    if (field.answer) {
      value = field.answer.value
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

<style>
.q-radio__inner{
  display: none;
}

</style>
