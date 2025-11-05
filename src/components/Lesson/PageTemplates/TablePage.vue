<template>
  <div class="full-width content-start">
    <q-card v-if="lesson.active.page?.data?.image" class="q-ma-md" flat>
        <q-img
            cover
            :src="lesson.active.page?.data?.image" />
        <LessonAudioPlayer/>
    </q-card>
    <div class="q-px-md q-pb-md" >
      <q-markup-table
        flat
        bordered
        separator="vertical"
        class="q-my-sm"
      >
        <thead v-if="table.header?.length > 0">
          <tr class="text-left">
            <th v-for="(th, thIndex) in table.header" :key="thIndex" class="q-pa-xs">
              <div style="white-space: wrap;" class="text-subtitle2"><b v-html="transliterateHTML(th.text)"></b></div>
            </th>
          </tr>
        </thead>
        <tr v-for="(row, index) in table.rows" :key="index">
          <td v-for="(column, colIndex) in row.column_list" :key="colIndex" class="relative-position q-pa-xs" style="white-space: normal;">
              <div v-html="transliterateHTML(column.text)"  class="q-py-sm"></div>

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
import { useTransliterate } from '../../../composables/useTransliterate'

const { transliterateHTML } = useTransliterate()

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
.q-markup-table tr:not(:last-child) td{
  border-bottom-width: 1px;
}
.q-table td,
.q-table th{
  padding: 4px 8px !important;
}
</style>
