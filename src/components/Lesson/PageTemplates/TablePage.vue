<template>
  <div class="full-width content-start" style="padding-top: 50px">
    <q-card v-if="lesson.active.page?.data?.image" class="q-ma-md">
        <q-img
            cover
            :src="`${CONFIG.API_HOST}/${lesson.active.page?.data?.image}`" />
        <LessonAudioPlayer/>
    </q-card>
    <div class="q-px-md q-pb-md" >
      <q-markup-table
        flat
        bordered
        separator="cell"
      >
        <thead v-if="table.header?.length > 0">
          <tr>
            <th v-for="(th, thIndex) in table.header" :key="thIndex">
              {{ th.text }}
            </th>
          </tr>
        </thead>
        <tr v-for="(row, index) in table.rows" :key="index">
          <td v-for="(column, colIndex) in row.column_list" :key="colIndex" class="relative-position" style="white-space: normal;">
              <div v-html="column.text"  class="q-py-sm"></div>

              <div v-if="column.audio_link" class="absolute-right">
                <q-btn  v-if="lessonAudio.list[lessonAudio.activeIndex]?.filename == column.audio_link && lessonAudio.is_playing"
                  flat
                  dense
                  size="sm"
                  class="play-audio"
                  :data-audio="column.audio_link"
                  @click="pauseAudio()"
                  icon="pause"
                />
                <q-btn  v-else
                  flat
                  dense
                  size="sm"
                  class="play-audio"
                  :data-audio="column.audio_link"
                  @click="playAudio(column.audio_link)"
                  icon="volume_up"
                />
              </div>
          </td>
        </tr>
      </q-markup-table>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, onMounted } from 'vue'
import LessonAudioPlayer from '../LessonAudioPlayer.vue'
import { useLesson } from '../../../composables/useLesson'
import { useLessonAudio } from '../../../composables/useLessonAudio'
import { CONFIG } from '../../../config.js'

const emits = defineEmits(['onRendered'])
const { lessonAudio, playAudio, pauseAudio, loadAudio } = useLessonAudio()

const { lesson } = useLesson()

const table = reactive({
  header: [],
  rows: []
})

const renderData = () => {
  table.header = lesson.active.page.data.table_header
  table.list = []
  for (const i in lesson.active.page.data.row_list) {
    for (const k in lesson.active.page.data.row_list[i].column_list) {
      if (lesson.active.page.data.row_list[i].column_list[k].text.indexOf('input') > -1) {
        const inputs = lesson.active.page.data.row_list[i].column_list[k].text.match(/{{input[0-9]+}}/g)
        for (const e in inputs) {
          const inputIndex = inputs[e].match(/[0-9]+/g)[0]
          lesson.active.page.data.row_list[i].column_list[k].text = lesson.active.page.data.row_list[i].column_list[k].text.replace(`{{input${inputIndex}}}`, `<span id="input_${inputIndex}"></span>`)
        }
      }
    }
    table.rows.push(lesson.active.page.data.row_list[i])
  }
}

renderData()

onMounted(() => {
  emits('onRendered', true)
  loadAudio()
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
