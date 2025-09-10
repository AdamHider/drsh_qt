<template>
  <div class="full-width content-start">
    <q-card v-if="lesson.active.page?.data?.image" class="q-ma-md">
        <q-img
            cover
            :src="`${CONFIG.API_HOST}/${lesson.active.page?.data?.image}`" />
        <LessonAudioPlayer/>
    </q-card>
    <div class="q-px-md q-pb-md q-pt-sm" >
      <div>
        <div v-for="(item, index) in pairs.items" :key="index" class="row items-stretch q-mb-md">
          <div v-for="(pair, colIndex) in item.pair_list" :key="colIndex" class="pair-block relative-position col " style="white-space: normal;">
            <q-card class="q-push full-height text-center flex items-center justify-center" style="box-shadow: 0px 0px 0px 2px lightgrey">
                <div class="full-width text-bold" v-html="pair.text"></div>

                <div v-if="pair.audio_link" class="absolute-right">
                  <q-btn  v-if="lessonAudio.list[lessonAudio.activeIndex]?.filename == pair.audio_link && lessonAudio.is_playing"
                    flat
                    dense
                    size="sm"
                    class="play-audio"
                    :data-audio="pair.audio_link"
                    @click="pauseAudio()"
                    icon="pause"
                  />
                  <q-btn  v-else
                    flat
                    dense
                    size="sm"
                    class="play-audio"
                    :data-audio="pair.audio_link"
                    @click="playAudio(pair.audio_link)"
                    icon="volume_up"
                  />
                </div>
            </q-card>
          </div>
        </div>
      </div>
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

const pairs = reactive({
  items: []
})

const renderData = () => {
  pairs.items = []
  for (const i in lesson.active.page.data.item_list) {
    for (const k in lesson.active.page.data.item_list[i].pair_list) {
      if (lesson.active.page.data.item_list[i].pair_list[k].text.indexOf('input') > -1) {
        const inputs = lesson.active.page.data.item_list[i].pair_list[k].text.match(/{{input[0-9]+}}/g)
        for (const e in inputs) {
          const inputIndex = inputs[e].match(/[0-9]+/g)[0]
          lesson.active.page.data.item_list[i].pair_list[k].text = lesson.active.page.data.item_list[i].pair_list[k].text.replace(`{{input${inputIndex}}}`, `<div id="input_${inputIndex}"></div>`)
        }
      }
    }
    pairs.items.push(lesson.active.page.data.item_list[i])
  }
}

renderData()

onMounted(() => {
  emits('onRendered', true)
  loadAudio()
})

</script>

<style lang="scss" >
.pair-block{
  .q-card{
    border-radius: 0px;
  }
  &:first-child .q-card{
    border-top-left-radius: $small-border-radius;
    border-bottom-left-radius: $small-border-radius;
  }
  &:last-child .q-card{
    border-top-right-radius: $small-border-radius;
    border-bottom-right-radius: $small-border-radius;
  }
}
.q-markup-table tr:not(:last-child) td{
  border-bottom-width: 1px;
}
</style>
