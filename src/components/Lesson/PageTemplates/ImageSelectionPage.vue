<template>
  <div class="full-width content-start " style="padding-top: 50px">
    <q-card class="q-ma-sm " flat>
          <q-img v-if="data.data.image"
            :src="`${CONFIG.API_HOST}/${data.data.image}`"
          >
          </q-img>
        <q-card-section vertical class="q-pa-none">
          <div v-html="data.data.text"></div>
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

const data = reactive({
  data: []
})

const renderData = () => {
  data.data = []
  if (lesson.active.page.data.text.indexOf('input') > -1) {
    const inputs = lesson.active.page.data.text.match(/{{input[0-9]+}}/g)
    for (const k in inputs) {
      const inputIndex = inputs[k].match(/[0-9]+/g)[0]
      lesson.active.page.data.text = lesson.active.page.data.text.replace(`{{input${inputIndex}}}`, `<span id="input_${inputIndex}"></span>`)
    }
  }
  data.data = lesson.active.page.data
  console.log(data.data)
}

renderData()

onMounted(() => {
  emits('onRendered', true)
})

</script>
