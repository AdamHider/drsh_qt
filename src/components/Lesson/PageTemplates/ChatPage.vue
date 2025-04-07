<template>
    <div class="full-width q-pa-md chat-container" :style="`align-self: end; padding-top: 50px; `" >

      <q-list class="q-mb-md">
        <div v-for="(replica, index) in replicaList.list" :key="index">
          <transition
            appear
            :enter-active-class="(!replica.rendered) ? `animated fadeInUp animation-delay-${replica.sortIndex}` : ''"
          >
            <q-item v-show="replica.is_shown">
              <q-item-section avatar >
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
          </transition>
        </div>

        <q-item v-if="isTyping">
          <q-item-section avatar >
            <q-avatar>
              <img :src="`https://cdn.quasar.dev/img/avatar5.jpg`">
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label lines="1"><b>Amet</b></q-item-label>
            <q-item-label style="white-space: break-spaces;"><q-spinner-dots size="2rem" /></q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
</template>

<script setup>
import { reactive, ref, watch, onMounted } from 'vue'
import { useLesson } from '../../../composables/useLesson'
import { CONFIG } from '../../../config.js'

const { lesson } = useLesson()

const emits = defineEmits(['onRendered'])

const replicaList = reactive({
  list: []
})
const inputList = ref([])


const currentAnswerIndex = ref(0)
const isTyping = ref(false)
const activeInput = ref(0)

const renderData = () => {
  replicaList.list = []
  var isShown = true;
  var inputIndex = 0;
  var isAnswered = false;
  for (const i in lesson.active.page.data.replica_list) {
    if (lesson.active.page.data.replica_list[i].text.indexOf('input') > -1) {
      const inputs = lesson.active.page.data.replica_list[i].text.match(/{{input[0-9]+}}/g)
      for (const k in inputs) {
        inputIndex = inputs[k].match(/[0-9]+/g)[0]
        isAnswered = lesson.active.page.fields.find((element) => element.index == inputIndex && element.answer)
        lesson.active.page.data.replica_list[i].input_index = inputIndex
        lesson.active.page.data.replica_list[i].is_answered = isAnswered
        lesson.active.page.data.replica_list[i].text = lesson.active.page.data.replica_list[i].text.replace(`{{input${inputIndex}}}`, `<span id="input_${inputIndex}"></span>`)
      }
    }
    lesson.active.page.data.replica_list[i].sortIndex = i
    lesson.active.page.data.replica_list[i].is_shown = isShown
    if(lesson.active.page.data.replica_list[i].input_index !== undefined && !lesson.active.page.data.replica_list[i].is_answered){
      activeInput.value = lesson.active.page.data.replica_list[i].input_index
      isShown = false
    }
    replicaList.list.push(lesson.active.page.data.replica_list[i])
  }
  console.log(inputList.value)
}

renderData()

onMounted(() => {
  emits('onRendered', true)
  window.scrollTo(0, document.body.scrollHeight)
})

watch(() => lesson.active.page, (newValue, oldValue) => {
  isTyping.value = true
  currentAnswerIndex.value = 0
  renderData()
  setTimeout(() => {
    window.scrollTo(0, document.body.scrollHeight)
    isTyping.value = false
  }, 100)
})

</script>

<style>
.chat-container .q-message-text:last-child{
  min-height: unset;
}
</style>
