<template>
  <div class="full-width content-start row " style="padding-top: 50px">
    <div class="col-6" v-for="(column, index) in columnList.list" :key="index">
      <q-card class="q-ma-sm">
            <q-img
              class="col"
              :src="`${CONFIG.API_HOST}/${column.image}`"
            >
              <q-chip v-if="column.flag">
                <q-avatar>
                  <img  :src="`${CONFIG.API_HOST}/${column.flag.image}`"/>
                </q-avatar>
                {{ column.flag.text }}
              </q-chip>
            </q-img>
          <q-card-section vertical class="flex flex-center text-center">
            <div class="text-subtitle1 text-bold" v-html="column.text"></div>
          </q-card-section>
          <q-card-section v-if="column.audio_link"  class="q-pt-none">
            <q-btn  v-if="lessonAudio.list[lessonAudio.activeIndex]?.filename == column.audio_link && lessonAudio.is_playing"
              flat
              class="play-audio full-width"
              :data-audio="column.audio_link"
              @click="pauseAudio()"
              icon="pause"
            />
            <q-btn  v-else
              class="play-audio full-width"
              flat
              :data-audio="column.audio_link"
              @click="playAudio(column.audio_link)"
              icon="volume_up"
            />
          </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, onMounted } from 'vue'
import { useLesson } from '../../../composables/useLesson'
import { useLessonAudio } from '../../../composables/useLessonAudio'
import { CONFIG } from '../../../config.js'

const emits = defineEmits(['onRendered'])
const { lessonAudio, playAudio, pauseAudio, loadAudio } = useLessonAudio()

const { lesson } = useLesson()

const columnList = reactive({
  list: []
})

const renderData = () => {
  columnList.list = []
  for (const i in lesson.active.page.data.column_list) {
    if (lesson.active.page.data.column_list[i].text.indexOf('input') > -1) {
      const inputs = lesson.active.page.data.column_list[i].text.match(/{{input[0-9]+}}/g)
      for (const k in inputs) {
        const inputIndex = inputs[k].match(/[0-9]+/g)[0]
        lesson.active.page.data.column_list[i].text = lesson.active.page.data.column_list[i].text.replace(`{{input${inputIndex}}}`, `<span id="input_${inputIndex}"></span>`)
      }
    }
    columnList.list.push(lesson.active.page.data.column_list[i])
  }
}

renderData()

onMounted(() => {
  emits('onRendered', true)
  loadAudio()
})

</script>
