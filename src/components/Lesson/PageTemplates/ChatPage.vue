<template>
     <div class="full-width q-pa-sm self-end" :style="`padding-top: 50px;`" >

      <q-list>
        <div v-for="(replica, index) in replicaList.list" :key="index">
          <transition
            appear
            :enter-active-class="(!replica.rendered) ? `animated fadeInUp animation-delay-${replica.sortIndex}` : ''"
          >
            <div v-show="replica.is_shown">
              <q-item class="q-px-sm">
                <q-item-section avatar v-if="!replica.input_index || replica.is_answered">
                  <q-avatar>
                    <img :src="replica?.image">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label lines="1" v-if="!replica.input_index || replica.is_answered"><b>{{ replica.name }}</b></q-item-label>
                  <q-item-label style="white-space: break-spaces;"><div v-html="replica.text"></div></q-item-label>
                </q-item-section>
                <q-item-section v-if="replica.audio_link" side>
                  <q-btn v-if="lessonAudio.list[lessonAudio.activeIndex]?.filename == replica.audio_link && lessonAudio.is_playing"
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
          </div>
          </transition>
        </div>

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
}

renderData()

onMounted(() => {
  emits('onRendered', true)
  window.scrollTo(0, document.body.scrollHeight)
})

watch(() => lesson.active.page, (newValue, oldValue) => {
  currentAnswerIndex.value = 0
  renderData()
  setTimeout(() => {
    window.scrollTo(0, document.body.scrollHeight)
  }, 100)
})

</script>
