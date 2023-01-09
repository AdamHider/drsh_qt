<template>
  <div class="full-width content-start row q-col-gutter-sm" style="padding-top: 50px">
    <div class="col-6" v-for="(column, index) in columnList.list" :key="index">
      <q-card>
            <q-img
              class="col"
              :src="`${CONFIG.API_HOST}/${column.image}`"
            />
          <q-card-section vertical class="flex flex-center">
            <div v-html="column.text"></div>
          </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, onMounted, defineEmits } from 'vue'
import { useLesson } from '../../../composables/useLesson'
import { CONFIG } from '../../../config.js'

const emits = defineEmits(['onRendered'])

const { lesson } = useLesson()

const columnList = reactive({
  list: []
})

const renderData = () => {
  columnList.list = []
  for (const i in lesson.active.page.data.column_list) {
    if (lesson.active.page.data.column_list[i].text.indexOf('input') > -1) {
      const inputs = lesson.active.page.data.column_list[i].text.match(/{{input[0-9]+}}/g)
      for (const k in inputs) {
        const inputIndex = inputs[k].match(/[0-9]+/g)[0]
        console.log(inputIndex)
        lesson.active.page.data.column_list[i].text = lesson.active.page.data.column_list[i].text.replace(`{{input${inputIndex}}}`, `<span id="input_${inputIndex}"></span>`)
      }
    }
    columnList.list.push(lesson.active.page.data.column_list[i])
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

.q-select.correct-answer.q-field--standard .q-field__control::before{
    border-color: $positive;
}
.q-select.wrong-answer.q-field--standard .q-field__control::before{
    border-color: $negative;
}
</style>
