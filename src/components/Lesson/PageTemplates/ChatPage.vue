<template>
    <div class="full-width q-pa-md chat-container" :style="`align-self: end; padding-top: 50px;  padding-bottom: ${(lesson.active.page?.answers?.is_finished) ? 30 : 120}px`" >
      <transition v-for="(replica, index) in replicaList.list" :key="index"
        appear
        :enter-active-class="(!replica.rendered) ? `animated fadeInUp animation-delay-${replica.sortIndex}` : ''"
      >
          <q-chat-message
            :sent="replica.type !== 'question'"
            text-color="white"
            :bg-color="(replica.type !== 'question') ? 'positive' : 'primary' "
          >
            <template v-slot:avatar v-if="replica.type === 'question'">
              <img
                class="q-message-avatar q-message-avatar--received"
                src="https://cdn.quasar.dev/img/avatar2.jpg"
                style="min-width: 40px; width: 40px; height: 40px"
              >
            </template>
            <div class="q-px-sm relative-position">
              <span v-html="replica.text"></span>
              <q-chip v-if="replica.type !== 'question'" class="absolute" style="bottom: -2em; left: -2em; width: 2em; min-width: 2em; padding: 0.3em;">
                {{ replica.reaction }}
              </q-chip>
            </div>
          </q-chat-message>
      </transition>

      <q-chat-message
        v-if="isTyping"
        name="Jane"
        avatar="https://cdn.quasar.dev/img/avatar5.jpg"
        bg-color="amber"
      >
        <q-spinner-dots size="2rem" />
      </q-chat-message>
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
const funnyEmojis = ['😀', '😉', '😊', '😎', '😍', '🙂', '👍']
const sadEmojis = ['😟', '😞', '😥', '😨', '😩']

const currentAnswerIndex = ref(0)
const isTyping = ref(true)

const markRendered = function () {
  replicaList.list.reverse()
  const replicasReversed = replicaList.list
  for (const i in replicasReversed) {
    if (replicasReversed[i].type === 'answer') {
      replicasReversed[i].rendered = false
      break
    }
    replicasReversed[i].rendered = false
  }

  replicasReversed.reverse()
  replicaList.list = replicasReversed
}

const setSortIndex = function () {
  let sortIndex = 1
  for (const i in replicaList.list) {
    replicaList.list[i].sortIndex = 1
    if (!replicaList.list[i].rendered) {
      replicaList.list[i].sortIndex = sortIndex
      sortIndex++
    }
  }
}

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
  window.scrollTo(0, document.body.scrollHeight)
})

watch(() => lesson.active.page, (newValue, oldValue) => {
  isTyping.value = true
  currentAnswerIndex.value = 0
  renderData()
  setTimeout(() => {
    window.scrollTo(0, document.body.scrollHeight)
  }, 100)
})

</script>

<style>
.chat-container .q-message-text:last-child{
  min-height: unset;
}
</style>
