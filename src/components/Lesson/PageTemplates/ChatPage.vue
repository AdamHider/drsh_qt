<template>
    <div class="full-width q-pa-md" :style="`align-self: end; padding-top: 50px;  padding-bottom: ${(lesson.active.page?.answers.is_finished) ? 0 : 120}px`" >
      <transition v-for="(replica, index) in replicaList.list" :key="index"
      appear
        :enter-active-class="(!replica.rendered) ? `animated slideInUp animationDelay${replica.sort_index}` : ''"
      >
          <q-chat-message
            :sent="replica.type !== 'question'"
            text-color="white"
            :bg-color="(replica.type !== 'question') ? 'positive' : 'primary' "
            avatar="https://cdn.quasar.dev/img/avatar4.jpg"
            :name="(replica.type !== 'question') ? 'me' : lesson.active.page?.data.second_person_name"
          >
            <div>
              <span v-html="replica.text"></span>
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
const funny_emojis = ['😀', '😉', '😊', '😎', '😍', '🙂', '👍']
const sad_emojis = ['😟', '😞', '😥', '😨', '😩']
const current_answer_index = ref(0)
const isTyping = ref(true)

const markRendered = function () {
  replicaList.list.reverse()
  const replicas_reversed = replicaList.list
  for (const i in replicas_reversed) {
    if (replicas_reversed[i].type == 'answer') {
      replicas_reversed[i].rendered = false
      break
    }
    replicas_reversed[i].rendered = false
  }

  replicas_reversed.reverse()
  replicaList.list = replicas_reversed
}

const setSortIndex = function () {
  let sort_index = 1
  for (const i in replicaList.list) {
    replicaList.list[i].sort_index = 1
    if (!replicaList.list[i].rendered) {
      replicaList.list[i].sort_index = sort_index
      sort_index++
    }
  }
}

const renderData = () => {
  if (!lesson.active.page) return
  replicaList.list = []
  for (const i in lesson.active.page.data.replica_list) {
    const replica = lesson.active.page.data.replica_list[i]
    replica.rendered = true
    if (replica.type == 'answer') {
      if (!lesson.active.page.answers.answers || !lesson.active.page.answers.answers[current_answer_index.value]) {
        break
      } else {
        var answer = lesson.active.page.answers.answers[current_answer_index.value]
        if (answer.is_correct == 'correct') {
          replica.text = answer.correct_answer
          replica.reaction = funny_emojis[i]
        } else {
          replica.text = answer.wrong_answer
          replica.reaction = sad_emojis[i]
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
      current_answer_index.value++
    }
    replicaList.list.push(replica)

    if (replica.type == 'answer') {
      if (answer && answer.tmp_answer && answer.is_correct !== 'correct') {
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
  console.log(replicaList.list)
  isTyping.value = false
}

renderData()

onMounted(() => {
  emits('onRendered', true)
  window.scrollTo(0, document.body.scrollHeight)
})

watch(() => lesson.active.page, (newValue, oldValue) => {
  isTyping.value = true
  current_answer_index.value = 0
  renderData()
  setTimeout(() => {
    window.scrollTo(0, document.body.scrollHeight)
  }, 100)
})

</script>

<style>
.animationDelay1{
  animation-delay: 250ms
}
.animationDelay2{
  animation-delay: 500ms
}
.animationDelay3{
  animation-delay: 750ms
}
</style>
