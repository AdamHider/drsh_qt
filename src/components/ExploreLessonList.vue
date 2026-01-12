<template>
  <div>
    <div class="q-mb-sm">
      <q-input
        class="q-ma-sm"
        standout
        dense
        v-model="formData.search"
        placeholder="Поиск планет..."
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
    <div v-if="lessons.length > 0" class="masonry-container q-pa-md ">
      <div v-for="(lesson, lessonIndex) in lessons" :key="`lessonIndex-${lessonIndex}`" :class="`masonry-item text-center`" :style="{ gridRowEnd: `span ${lesson.appearance.spans}` }">
        <q-card
            :class="`q-push q-pa-sm relative-position rounded-md  text-white text-shadow ${lesson.is_blocked ? 'is-blocked' : ''} ${lesson.appearance.class}`" @click="router.push(`/lesson-startup-${lesson.id}`)"
            :style="`border-color: rgba(0, 0, 0, 0.7); background-image: linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0)), url(${(lesson.background_image) ? lesson.background_image : lesson.course_section.background_image}); background-size: cover; background-position: center;`">
            <q-img class="planet-image allow-overflow absolute" :src="lesson.image"  :width="`${lesson.appearance.width}%`" style="filter: drop-shadow(rgba(53, 173, 244, 0.62) 0px 5px 10px);" no-spinner/>
          <q-card-section class="q-py-sm q-px-xs">
            <div class="text-subtitle1"><b>{{ lesson.title }}</b></div>
          </q-card-section>
          <div class="q-ma-sm" :class="{
            'absolute-top-right': ['align-end-right'].indexOf(lesson.appearance.class) > -1,
            'absolute-bottom-right': ['align-start-right'].indexOf(lesson.appearance.class) > -1,
            'absolute-top-left': ['align-end-left'].indexOf(lesson.appearance.class) > -1,
            'absolute-bottom-left': ['align-start-left'].indexOf(lesson.appearance.class) > -1,
          }">
            <q-btn v-if="lesson.is_blocked" round flat class="bg-dark-transparent-50" icon="lock"></q-btn>
            <q-btn v-else-if="lesson.progress == 100" round flat class="bg-dark-transparent-50 text-positive" icon="check"></q-btn>
            <q-btn v-else-if="lesson.progress > 0" round flat class="bg-dark-transparent-50" icon="chevron_right"></q-btn>
            <q-btn v-else round flat class="bg-dark-transparent-50" icon="rocket"></q-btn>
          </div>
          
        </q-card>
      </div>
    </div>
    <BannerNotFound v-else
      title="Упс..."
      description="Планет и созвездий не найдено"
      default-image
    />
  </div>
</template>

<script setup>
import { ref, toRef, onMounted, onActivated, reactive, watch } from 'vue'
import { api } from '../services/index'
import { useRouter } from "vue-router";
import { Swiper, SwiperSlide } from 'swiper/vue'
import { playAudio } from 'src/services/audioService';
import BannerNotFound from './BannerNotFound.vue'

import 'swiper/css'

const router = useRouter();

const error = ref(false)

const lessons = ref([])
const courseSections = ref([])
const tags = ref([])
const formData = reactive({
  tags: [],
  search: ''
})

const props = defineProps({
  activeOnly: Boolean,
  type: String,
  slidesPerView: Number,
  reloadTrigger: Boolean
})


const load = async () => {
  const filter = {
    tags: formData.tags,
    search: formData.search,
    type: 'all'
  }
  const courseSectionListResponse = await api.explore.getList(filter)
  if (courseSectionListResponse.error) {
    error.value = courseSectionListResponse
    lessons.value = []
    return false;
  }
  lessons.value = courseSectionListResponse
}

const pluralHumanize = (n, wordsConfig) => {
  if(!wordsConfig) return ''
  const absN = Math.abs(n)
  const lastDigit = absN % 10
  const lastTwoDigits = absN % 100
  let word = wordsConfig[0]
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    word = wordsConfig[0]
  } else if (lastDigit === 1) {
    word = wordsConfig[1]
  } else if (lastDigit >= 2 && lastDigit <= 4) {
    word = wordsConfig[2]
  }
  return word
}

onActivated(() => {
  load()
})
onMounted(() => {
  load()
})
watch(formData, () => {
  load()
})

</script>
<style scoped lang="scss">
.is-blocked{
  filter: grayscale(1) brightness(0.9);
}
.masonry-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: 5px;
  gap: 8px;
}

.masonry-item {
  display: flex;
  flex-direction: column;
  .q-card{
    height: 100%;
    display: flex;
    overflow: hidden;
    &.align-start-left{
      flex-direction: column;
      text-align: left;
      .q-img{
        right: -20%;
        bottom: -10%;
      }
    }
    &.align-start-right{
      flex-direction: column;
      text-align: right;
      .q-img{
        left: -20%;
        bottom: -10%;
      }
    }
    &.align-end-left{
      flex-direction: column-reverse;
      text-align: left;
      .q-img{
        right: -20%;
        top: -10%;
      }
    }
    &.align-end-right{
      flex-direction: column-reverse;
      text-align: right;
      .q-img{
        left: -20%;
        top: -10%;
      }
    }
  }
}

.small { height: 200px; }
.medium { height: 230px; }
.large { height: 260px; }

@media (max-width: 800px) { .masonry-container { column-count: 2; } }
</style>
