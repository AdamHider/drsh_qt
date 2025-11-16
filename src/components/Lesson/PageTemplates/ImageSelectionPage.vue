<template>
  <div class="full-width content-start">
    <q-card class="q-ma-sm " flat>
        <q-card-section class="q-pa-sm text-center">
          <q-img v-if="data.data.image"
            style="max-width: min(calc(90vh - 420px), 400px);"
            class="rounded-borders"
            :src="data.data.image"
            no-spinner
          />
          <div class="absolute-right" style="bottom: 20px; top: unset" v-if="lesson.active.page.header?.training">
            <q-btn v-if="!trainingLinked" size="sm" push
                class="bg-dark-transparent-50 text-white" @click="linkTraining()" :loading="trainingIsLoading">
              + Тренеровать
            </q-btn>
            <q-btn v-else size="sm" push class="bg-positive text-white" >
               Тренеруется
            </q-btn>
          </div>
        </q-card-section>
        <q-card-section vertical :class="`q-pa-none text-center ${(!data.data.is_form) ? 'flex flex-center text-center' : ''}`">
          <div v-if="!data.data.is_form" class="text-h6">
            <b v-html="transliterateHTML(data.data.text)"></b>
            <span v-if="data.data.audio_link" >
              <q-btn  v-if="lessonAudio.list[lessonAudio.activeIndex]?.filename == data.data.audio_link && lessonAudio.is_playing"
                flat
                class="play-audio"
                :data-audio="data.data.audio_link"
                @click="pauseAudio()"
                color="gray"
                icon="pause"
              />
              <q-btn  v-else
                flat
                class="play-audio"
                :data-audio="data.data.audio_link"
                @click="playAudio(data.data.audio_link)"
                color="gray"
                icon="volume_up"
              />
            </span>
          </div>
          <div v-else class="text-bold text-h6">

              <div v-html="data.data.text"></div>
          </div>
        </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useLesson } from '../../../composables/useLesson'
import { useLessonAudio } from '../../../composables/useLessonAudio'
import { useTransliterate } from '../../../composables/useTransliterate'

const emits = defineEmits(['onRendered'])

const { lesson, linkTrainingItem } = useLesson()
const { lessonAudio, playAudio, pauseAudio, loadAudio } = useLessonAudio()
const { transliterateHTML } = useTransliterate()

const trainingIsLoading = ref(false)
const trainingLinked = ref(false)

const data = reactive({
  data: []
})

const renderData = () => {
  data.data = []
  if (lesson.active.page.data.text.indexOf('input') > -1) {
    const inputs = lesson.active.page.data.text.match(/{{input[0-9]+}}/g)
    lesson.active.page.data.is_form = inputs.length > 0
    for (const k in inputs) {
      const inputIndex = inputs[k].match(/[0-9]+/g)[0]
      lesson.active.page.data.text = lesson.active.page.data.text.replace(`{{input${inputIndex}}}`, `<span id="input_${inputIndex}"></span>`)
    }
  }
  data.data = lesson.active.page.data

  if(lesson.active.page.header.training){
    trainingLinked.value = lesson.active.page.header.training?.is_linked
  }
}
const linkTraining = async () => {
  trainingIsLoading.value = true
  trainingLinked.value = await linkTrainingItem()
  trainingIsLoading.value = false
}
renderData()

onMounted(() => {
  emits('onRendered', true)
  loadAudio()
})

</script>
