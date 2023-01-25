<template>
    <div class="full-width q-pa-md chat-container" :style="`align-self: end; padding-top: 50px;  padding-bottom: ${(lesson.active.page?.answers.is_finished) ? 30 : 120}px`" >
      <transition v-for="(replica, index) in replicaList.list" :key="index"
        appear
        :enter-active-class="(!replica.rendered) ? `animated fadeInUp animationDelay${replica.sortIndex}` : ''"
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
  if (!lesson.active.page) return
  replicaList.list = []
  for (const i in lesson.active.page.data.replica_list) {
    const replica = lesson.active.page.data.replica_list[i]
    replica.rendered = true
    if (replica.type === 'answer') {
      if (!lesson.active.page.answers.answers || !lesson.active.page.answers.answers[currentAnswerIndex.value]) {
        break
      } else {
        var answer = lesson.active.page.answers.answers[currentAnswerIndex.value]
        if (answer.is_correct) {
          replica.text = answer.value
          replica.reaction = funnyEmojis[currentAnswerIndex.value]
        } else {
          replica.text = answer.value
          replica.reaction = sadEmojis[currentAnswerIndex.value]
        }
        if (answer.tmp_answer !== '') {
          replicaList.list.push({
            rendered: true,
            type: 'answer',
            reaction: replica.reaction,
            text: answer.tmp_answer
          })
          replicaList.list.push({
            rendered: true,
            type: 'question',
            text: 'I dont understand'
          })
          if (answer.is_temp) {
            break
          }
        }
      }
      currentAnswerIndex.value++
    }
    replicaList.list.push(replica)

    if (replica.type === 'answer') {
      if (answer && answer.tmp_answer && !answer.is_correct) {
        replicaList.list.push({
          rendered: true,
          type: 'question',
          reaction: replica.reaction,
          text: 'Okay'
        })
      }
    }
  }
  markRendered()
  setSortIndex()
  isTyping.value = false
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
.chat-container .animationDelay1{
  animation-delay: 250ms
}
.chat-container .animationDelay2{
  animation-delay: 500ms
}
.chat-container .animationDelay3{
  animation-delay: 750ms
}
.chat-container .q-message-text:last-child{
  min-height: unset;
}
</style>
