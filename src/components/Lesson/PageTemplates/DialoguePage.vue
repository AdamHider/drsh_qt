<template>
  <div class="full-width" style="padding-top: 50px">
    <q-card v-if="lesson.active.page?.data?.image" class="q-ma-md">
        <q-img
            cover
            :src="`${CONFIG.API_HOST}/${lesson.active.page?.data?.image}`" />
    </q-card>
    <LessonAudioPlayer/>
    <q-list class="q-mb-md">
      <q-item  v-for="(replica, index) in replicaList.list" :key="index" >
        <q-item-section avatar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/avatar2.jpg">
            <a class="play-audio absolute" :data-audio="replica.audio_link" @click="playAudio(replica.audio_link)"><q-icon name="play_arrow"/></a>
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1"><b>{{ replica.name }}</b></q-item-label>
          <q-item-label lines="3" ><div v-html="replica.text"></div></q-item-label>
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
const { lessonAudio, playAudio, loadAudio } = useLessonAudio()

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
        console.log(inputIndex)
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

<style lang="scss">
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
