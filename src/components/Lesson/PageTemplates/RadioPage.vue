<template>
  <div class="full-width" style="padding-top: 50px">
    <q-card v-if="lesson.active.page?.data?.image" class="q-ma-md">
      <q-card-section class="q-pa-none ">
        <q-img
            class="rounded-borders"
            cover
            :src="`${CONFIG.API_HOST}/${lesson.active.page?.data?.image}`" />
        </q-card-section>
        <LessonAudioPlayer v-if="lessonAudio.list.length > 0"/>
    </q-card>
    <q-list class="q-mb-md">
      <q-item  v-for="(item, index) in itemList.list" :key="index" dense >
        <q-item-section>
          <q-item-label lines="1" class="text-subtitle1"><b>{{ item.title }}</b></q-item-label>
          <q-item-label><div class="text-subtitle1 text-bold" v-html="item.text"></div></q-item-label>
        </q-item-section>
        <q-item-section v-if="item.audio_link" side>
          <q-btn  v-if="lessonAudio.list[lessonAudio.activeIndex]?.filename == replica.audio_link && lessonAudio.is_playing"
            flat
            class="play-audio"
            :data-audio="item.audio_link"
            @click="pauseAudio()"
            icon="pause"
          />
          <q-btn  v-else
            class="play-audio"
            :data-audio="item.audio_link"
            @click="playAudio(item.audio_link)"
            icon="play_arrow"
          />
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

const itemList = reactive({
  list: []
})

const renderData = () => {
  itemList.list = []
  for (const i in lesson.active.page.data.radio_list) {
    if (lesson.active.page.data.radio_list	[i].text.indexOf('input') > -1) {
      const inputs = lesson.active.page.data.radio_list[i].text.match(/{{input[0-9]+}}/g)
      for (const k in inputs) {
        const inputIndex = inputs[k].match(/[0-9]+/g)[0]
        lesson.active.page.data.radio_list[i].text = lesson.active.page.data.radio_list[i].text.replace(`{{input${inputIndex}}}`, `<span id="input_${inputIndex}"></span>`)
      }
    }
    itemList.list.push(lesson.active.page.data.radio_list[i])
  }
}

renderData()

onMounted(() => {
  emits('onRendered', true)
  loadAudio()
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
