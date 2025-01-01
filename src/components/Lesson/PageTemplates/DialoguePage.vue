<template>
  <div class="full-width" style="padding-top: 50px">
    <q-card v-if="lesson.active.page?.header?.image" class="q-ma-md">
      <q-card-section class="q-pa-none ">
        <q-img
            class="rounded-borders"
            cover
            :src="`${CONFIG.API_HOST}/${lesson.active.page?.header?.image}`" />
        </q-card-section>
        <LessonAudioPlayer/>
    </q-card>
    <q-list class="q-mb-md">
      <q-item  v-for="(replica, index) in replicaList.list" :key="index" >
        <q-item-section avatar>
          <q-avatar>
            <img :src="`${CONFIG.API_HOST}/${(replica?.image) ? replica?.image : 'image/placeholder.jpg'}`">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1"><b>{{ replica.name }}</b></q-item-label>
          <q-item-label style="white-space: break-spaces;"><div v-html="replica.text"></div></q-item-label>
        </q-item-section>
        <q-item-section v-if="replica.audio_link" side>
          <q-btn  v-if="lessonAudio.list[lessonAudio.activeIndex]?.filename == replica.audio_link && lessonAudio.is_playing"
            flat
            class="play-audio"
            :data-audio="replica.audio_link"
            @click="pauseAudio()"
            icon="pause"
          />
          <q-btn  v-else
            class="play-audio"
            :data-audio="replica.audio_link"
            @click="playAudio(replica.audio_link)"
            icon="play_arrow"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup>
import { reactive, onMounted, defineEmits } from 'vue'
import LessonAudioPlayer from '../LessonAudioPlayer.vue'
import { useLesson } from '../../../composables/useLesson'
import { useLessonAudio } from '../../../composables/useLessonAudio'
import { CONFIG } from '../../../config.js'

const emits = defineEmits(['onRendered'])

const { lesson } = useLesson()
const { lessonAudio, playAudio, pauseAudio, loadAudio } = useLessonAudio()

const replicaList = reactive({
  list: []
})

const renderData = () => {
  replicaList.list = []
  for (const i in lesson.active.page.data.replica_list) {
    if (lesson.active.page.data.replica_list[i].text.indexOf('input') > -1) {
      const inputs = lesson.active.page.data.replica_list[i].text.match(/{{input[0-9]+}}/g)
      for (const k in inputs) {
        const inputIndex = inputs[k].match(/[0-9]+/g)[0]
        lesson.active.page.data.replica_list[i].text = lesson.active.page.data.replica_list[i].text.replace(`{{input${inputIndex}}}`, `<span id="input_${inputIndex}"></span>`)
      }
    }
    replicaList.list.push(lesson.active.page.data.replica_list[i])
  }
}

renderData()

onMounted(() => {
  emits('onRendered', true)
  loadAudio()
})

</script>
