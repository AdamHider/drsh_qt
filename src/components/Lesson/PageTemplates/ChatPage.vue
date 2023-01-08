<template>
    <div class="full-width q-pa-md" :style="`align-self: end; padding-top: 50px;  padding-bottom: ${(lesson.active.page?.answers.is_finished) ? 0 : 120}px`" >
          <q-chat-message  v-for="(replica, index) in replicaList.list" :key="index"
            :sent="replica.type !== 'question'"
            text-color="white"
            bg-color="primary"
            avatar="https://cdn.quasar.dev/img/avatar4.jpg"
            name="me"
          >
            <div>
              <span v-html="replica.text"></span>
            </div>
          </q-chat-message>
          <q-item  v-for="(replica, index) in replicaList.list" :key="index" >
            <q-item-section avatar>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/avatar2.jpg">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1"><b>{{ lesson.active.page.data.second_person_name }}</b></q-item-label>
              <q-item-label lines="2" v-html="replica.text"></q-item-label>
            </q-item-section>
            <q-item-section side top>
              1 min ago
            </q-item-section>
          </q-item>
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

const markRendered = function () {
  replicaList.list.reverse()
  const replicas_reversed = replicaList.list
  for (const i in replicas_reversed) {
    if (replicas_reversed[i].type == 'answer') break
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
}

renderData()

onMounted(() => {
  emits('onRendered', true)
  window.scrollTo(0, document.body.scrollHeight)
})

watch(() => lesson.active.page, (newValue, oldValue) => {
  current_answer_index.value = 0
  renderData()
  console.log('scroll bottom')
  setTimeout(() => {
    window.scrollTo(0, document.body.scrollHeight)
  }, 100)
})

</script>

<style>
.q-page{
  align-content: end;
}
</style>
