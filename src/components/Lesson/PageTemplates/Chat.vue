<template>
    <div class="full-width" style="align-self: end">
      <q-infinite-scroll ref="infiniteList" scroll-taget="scroll-area" reverse class="relative-position" style="z-index: 1;padding-top: 50px">
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
      </q-infinite-scroll>
      <q-input v-if="formData.fields[current_input_index]"
          outlined
          autogrow
          placeholder="Enter message..."
          v-model="formData.fields[current_input_index].value"
          :options="formData.fields[current_input_index].options"
          class="full-width"
      >
          <template v-slot:append>
          <q-btn round dense flat icon="send" @click="emits('onAnswerSaved')" />
          </template>
      </q-input>
      </div>
</template>

<script setup>
import { reactive, ref, watch, defineEmits, onActivated, isReactive  } from 'vue'
import { useLesson } from '../../../composables/useLesson'
import { CONFIG } from '../../../config.js'


const { lesson } = useLesson()

const emits = defineEmits(['update-answer', 'onAnswerSaved'])

const replicaList = reactive({
  list: []
})
const formData = reactive({
  fields: {}
})

const funny_emojis = ['😀', '😉', '😊', '😎', '😍', '🙂', '👍']
const sad_emojis = ['😟', '😞', '😥', '😨', '😩']
const current_answer_index = ref(0)
const current_input_index = ref(0)

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
          replica.reaction = funny_emojis[current_input_index.value]
        } else {
          replica.text = answer.wrong_answer
          replica.reaction = sad_emojis[current_input_index.value]
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
      current_input_index.value++
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
const renderFields = () => {
  formData.fields = {}
  if (!lesson.active.page.fields || lesson.active.page.answers.is_finished) return
  const field = lesson.active.page.fields[current_answer_index.value]
  let value = ''
  const options = field.variants
  if (field.answer) {
    if (field.answer.is_correct == 'wrong') {
      value = field.answer.wrong_answer
    } else {
      value = field.answer.correct_answer
    }
  }
  formData.fields[current_answer_index.value] = { value, options, index: field.index }
  emits('update-answer', formData.fields)
}

renderData()
renderFields()

watch(() => lesson.active.page, (newValue, oldValue) => {
    
    current_answer_index.value = 0
    current_input_index.value = 0
  renderData()
  renderFields()
})

watch(formData.fields, (newValue, oldValue) => {
  emits('update-answer', formData.fields)
})

</script>

<style lang="scss" scoped>
.q-page-sticky--shrink > div{
  width: 100%;
}
</style>
