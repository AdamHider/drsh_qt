<template>
  <div class="full-width">
    <q-card v-if="lesson.active.page?.data?.image" class="q-ma-md" flat>
      <q-card-section class="q-pa-sm text-center">
      <q-img
          cover
          :src="lesson.active.page?.data?.image"
          class="rounded-borders"
          style="max-width: min(calc(90vh - 420px), 400px);"/>
        <LessonAudioPlayer v-if="lessonAudio.list.length > 0"/>
      </q-card-section>
    </q-card>
    <q-list :class="`q-mb-md ${(lesson.active.page?.data?.image) ? 'text-center' : 'text-left'}`">
      <q-item>
        <q-item-section>
          <q-item-label><div :class="`${(lesson.active.page?.data?.image) ? 'text-subtitle1 text-bold' : 'text-subtitle2'}`" v-html="transliterateHTML(text.text)"></div></q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup>
import { reactive, watch, onMounted } from 'vue'
import LessonAudioPlayer from '../LessonAudioPlayer.vue'
import { useLesson } from '../../../composables/useLesson'
import { useTransliterate } from '../../../composables/useTransliterate'
import { useLessonAudio } from '../../../composables/useLessonAudio'

const { lessonAudio, playAudio, pauseAudio, loadAudio } = useLessonAudio()

const { transliterateHTML } = useTransliterate()

const emits = defineEmits(['onRendered'])

const { lesson } = useLesson()

const text = reactive({
  text: '',
  image: ''
})

const renderData = () => {
  text.text = lesson.active.page.data.text
  if (lesson.active.page.data.text.indexOf('input') > -1) {
    const inputs = text.text.match(/{{input[0-9]+}}/g)
    for (const k in inputs) {
      const inputIndex = inputs[k].match(/[0-9]+/g)[0]
      text.text = text.text.replace(`{{input${inputIndex}}}`, `<span id="input_${inputIndex}"></span>`)
    }
  }
  text.image = lesson.active.page.data.image
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
