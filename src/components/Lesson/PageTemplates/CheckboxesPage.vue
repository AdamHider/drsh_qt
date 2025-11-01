<template>
  <div class="full-width" style="padding-top: 50px">
    <q-card v-if="lesson.active.page?.data?.image" class="q-ma-md">
      <q-card-section class="q-pa-none ">
        <q-img
            class="rounded-borders"
            cover
            :src="`${CONFIG.API_HOST}/${lesson.active.page?.data?.image}`"
            style="max-width: min(calc(90vh - 420px), 400px);"/>
        </q-card-section>
        <LessonAudioPlayer/>
    </q-card>
    <div class="full-width content-start row">
      <div class="col-6" v-for="(column, index) in checkboxesList.list" :key="index">
          <div v-html="column.text"></div>
      </div>
    </div>
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

const checkboxesList = reactive({
  list: []
})

const renderData = () => {
  checkboxesList.list = []
  for (const i in lesson.active.page.data.checkboxes_list) {
    if (lesson.active.page.data.checkboxes_list[i].text.indexOf('input') > -1) {
      const inputs = lesson.active.page.data.checkboxes_list[i].text.match(/{{input[0-9]+}}/g)
      for (const k in inputs) {
        const inputIndex = inputs[k].match(/[0-9]+/g)[0]
        lesson.active.page.data.checkboxes_list[i].text = lesson.active.page.data.checkboxes_list[i].text.replace(`{{input${inputIndex}}}`, `<span id="input_${inputIndex}"></span>`)
      }
    }
    checkboxesList.list.push(lesson.active.page.data.checkboxes_list[i])
  }
}

renderData()

onMounted(() => {
  emits('onRendered', true)
  loadAudio()
})

</script>
