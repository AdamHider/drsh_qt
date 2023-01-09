<template>
  <div class="full-width" style="padding-top: 50px">
    <q-card class="q-ma-md" v-for="(block, index) in blockList.list" :key="index">
      <q-card-section horizontal>
          <q-img
            class="col"
            :src="`${CONFIG.API_HOST}/${block.image}`"
          />
        <q-card-section vertical class="col-7 flex flex-center">
          <div v-html="block.text"></div>
        </q-card-section>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { reactive, watch, onMounted, defineEmits } from 'vue'
import { useLesson } from '../../../composables/useLesson'
import { CONFIG } from '../../../config.js'

const emits = defineEmits(['onRendered'])

const { lesson } = useLesson()

const blockList = reactive({
  list: []
})

const renderData = () => {
  blockList.list = []
  for (const i in lesson.active.page.data.block_list) {
    if (lesson.active.page.data.block_list[i].text.indexOf('input') > -1) {
      const inputs = lesson.active.page.data.block_list[i].text.match(/{{input[0-9]+}}/g)
      for (const k in inputs) {
        const inputIndex = inputs[k].match(/[0-9]+/g)[0]
        console.log(inputIndex)
        lesson.active.page.data.block_list[i].text = lesson.active.page.data.block_list[i].text.replace(`{{input${inputIndex}}}`, `<span id="input_${inputIndex}"></span>`)
      }
    }
    blockList.list.push(lesson.active.page.data.block_list[i])
  }
}

renderData()

onMounted(() => {
  emits('onRendered', true)
})

</script>

<style lang="scss" >
.q-select.q-select-inline .q-field__control,
.q-select.q-select-inline .q-field__native {
  min-height: 18px;
  padding: 0;
}

.green-word{
  color: $positive
}
.orange-word{
  color: $accent
}

.q-select.correct-answer.q-field--standard .q-field__control::before{
    border-color: $positive;
}
.q-select.wrong-answer.q-field--standard .q-field__control::before{
    border-color: $negative;
}
</style>
