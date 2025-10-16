<template>
  <div class="full-width">
    <q-card v-if="lesson.active.page?.data?.image" class="q-ma-md " flat>
      <q-img
          cover
          :src="lesson.active.page?.data?.image"
          style="max-width: min(calc(90vh - 420px), 100vw);"/>
        <LessonAudioPlayer v-if="lessonAudio.list.length > 0"/>
    </q-card>
    <div class="q-mb-md  syllables-grid">
      <q-card class="syllables-image rounded-sm" flat v-for="(item, index) in words.listActive" :key="index" dense >
        <div>
          <q-img
          class="rounded-sm"
            cover
            :src="item.image"/>
          <div class="text-subtitle1 text-bold" v-html="transliterateHTML(item.text)"></div>
          <div v-if="item.audio_link" side>
            <q-btn  v-if="lessonAudio.list[lessonAudio.activeIndex]?.filename == item.audio_link && lessonAudio.is_playing"
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
          </div>
        </div>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, onMounted } from 'vue'
import LessonAudioPlayer from '../LessonAudioPlayer.vue'
import { useLesson } from '../../../composables/useLesson'
import { useLessonAudio } from '../../../composables/useLessonAudio'
import { useTransliterate } from '../../../composables/useTransliterate'

const { transliterateHTML } = useTransliterate()

const emits = defineEmits(['onRendered'])

const { lesson } = useLesson()
const { lessonAudio, playAudio, pauseAudio, loadAudio } = useLessonAudio()


const words = reactive({
  list: [],
  listActive: []
})

const renderData = () => {
  for (const i in lesson.active.page.data.word_list) {
    if (lesson.active.page.data.word_list[i].text.indexOf('input') > -1) {
      const inputs = lesson.active.page.data.word_list[i].text.match(/{{input[0-9]+}}/g)
      for (const k in inputs) {
        const inputIndex = inputs[k].match(/[0-9]+/g)[0]
        lesson.active.page.data.word_list[i].text = lesson.active.page.data.word_list[i].text.replace(`{{input${inputIndex}}}`, `<span id="input_${inputIndex}"></span>`)
      }
    }
  }
  setAllWords()
}
const setAllWords = () => {
  words.list = []
  for (const i in lesson.active.page.data.word_list) {
    if(lesson.active.page.fields && !lesson.active.page.fields[i].answer){
      lesson.active.page.data.word_list[i].status = 'active'
    } else {
      lesson.active.page.data.word_list[i].status = 'answered'
    }
    words.list.push(lesson.active.page.data.word_list[i])
  }
}
const setActiveWords = () => {
  for (const i in words.list) {
    if(words.list[i].status == 'active' && words.listActive.length < 4){
      words.listActive.push(lesson.active.page.data.word_list[i])
    }
  }
}
const getInactiveWords = () => {
  var result = [];
  const activeWordsCount = 4
  const active_words = words.list.filter((item) => {return item.status == 'active'})
  for(var i in active_words){
    if(i >= activeWordsCount){
      result.push(active_words[i])
    }
  }
  result.push({text: ""})
  return result;
}
const refillWords = (changedIndex) => {
  var inactiveWords = getInactiveWords()
  words.listActive[changedIndex] = inactiveWords[0]
  inactiveWords.shift();
}
const findDifferences = (newArray, oldArray) => {
  for(var i in newArray){
    if(newArray[i].answer && !oldArray[i].answer){
      return words.listActive.findIndex(item => item.index == newArray[i].index);
    }
  }
  return null
}
renderData()
setActiveWords()


onMounted(() => {
  emits('onRendered', true)
})
watch(() => lesson.active.page, (newValue, oldValue) => {
  const changedIndex = findDifferences(newValue.fields, oldValue.fields)
  refillWords(changedIndex)
  renderData()
})

</script>

<style lang="scss" >
.syllables-grid{
  display: grid;
  grid-template-areas:
    "a b"
    "c d";
}

.syllables-grid > div:nth-child(1){
  grid-area: a;
}
.syllables-grid > div:nth-child(2){
  grid-area: b;
}
.syllables-grid > div:nth-child(3){
  grid-area: c;
}
.syllables-grid > div:nth-child(4){
  grid-area: d;
}
</style>
