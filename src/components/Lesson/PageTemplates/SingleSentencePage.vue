<template>
  <div class="full-width" style="padding-top: 50px">
    <q-card v-if="text.image" class="q-ma-md">
      <q-card-section class="q-pa-none ">
          <q-img v-if="text.image"
            class="rounded-borders"
            :src="`${CONFIG.API_HOST}/${text.image}`"
          />
        </q-card-section>
        <LessonAudioPlayer v-if="lessonAudio.list.length > 0"/>
    </q-card>
    <q-list class="q-mb-md text-center">
      <q-item>
        <q-item-section>
          <q-item-label><div class="text-subtitle1 text-bold" v-html="text.text"></div></q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup>
import { reactive, watch, onMounted } from 'vue'
import LessonAudioPlayer from '../LessonAudioPlayer.vue'
import { useLesson } from '../../../composables/useLesson'
import { useLessonAudio } from '../../../composables/useLessonAudio'
import { CONFIG } from '../../../config.js'

const emits = defineEmits(['onRendered'])

const { lesson } = useLesson()
const { lessonAudio, playAudio, pauseAudio, loadAudio } = useLessonAudio()

const text = reactive({
  text: '',
  image: ''
})

const renderData = () => {
  if (lesson.active.page.data.text.indexOf('input') > -1) {
    text.text = lesson.active.page.data.text
    const inputs = text.text.match(/{{input[0-9]+}}/g)
    for (const k in inputs) {
      const inputIndex = inputs[k].match(/[0-9]+/g)[0]
      text.text = text.text.replace(`{{input${inputIndex}}}`, `<span id="input_${inputIndex}"></span>`)
    }
  }
  text.image = lesson.active.page.data.image
  console.log(text.image)
}

renderData()

onMounted(() => {
  emits('onRendered', true)
})

</script>

<style lang="scss" >
.q-select.q-select-inline .q-field__control,
.q-select.q-select-inline .q-field__native {
  min-height: 18px;
  padding: 0;
}

.q-select.correct-answer.q-field--standard .q-field__control::before{
    border-color: $positive;
}
.q-select.wrong-answer.q-field--standard .q-field__control::before{
    border-color: $negative;
}
</style>
