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
    <div v-if="courseSections.length > 0">
      <div v-for="(courseSection, courseSectionIndex) in courseSections" :key="`courseSectionIndex-${courseSectionIndex}`" >
          <q-card flat>
            <q-card-section class="q-py-none">
              <q-item class="q-px-xs q-pb-none" clickable v-ripple :to="`explore-section-${courseSection.id}`">
                <q-item-section>
                  <div class="text-subtitle1"><b>{{ courseSection.title }}</b></div>
                </q-item-section>
                <q-item-section side>
                  <q-btn flat round dense icon="chevron_right"></q-btn>
                </q-item-section>
              </q-item>
              <div>
                <div class="flex justify-between text-caption q-ma-xs">
                  <div class="text-grey-8"><b>Исследовано:</b></div>
                  <div><b>{{ courseSection.progress?.percentage }}%</b></div>
                </div>
                <q-progress-bar :value="courseSection.progress?.percentage" size="20px" color="orange" />
              </div>
            </q-card-section>
            <q-card-section class="q-pa-none">
              <swiper
                :slidesPerView="props.slidesPerView"
                :spaceBetween="8"
                :slidesOffsetBefore="16"
                :slidesOffsetAfter="16"
              >
                <swiper-slide v-for="(lesson, lessonIndex) in courseSection.list" :key="`lessonIndex-${lessonIndex}`" :class="'text-center'">
                  <q-card
                      :class="`q-push relative-position rounded-md  text-white text-shadow ${lesson.is_blocked ? 'is-blocked' : ''}`" @click="router.push(`/lesson-startup-${lesson.id}`)"
                      :style="`margin-top: 30px; border-color: rgba(0, 0, 0, 0.7); background-image: linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0)), url(${(lesson.background_image) ? lesson.background_image : lesson.course_section.background_image}); background-size: cover; background-position: center;`">
                    <q-card-section class="q-pb-none">
                      <q-img class="planet-image allow-overflow" :src="lesson.image" width="100px" style="filter: drop-shadow(rgba(53, 173, 244, 0.62) 0px 5px 10px); margin-top: -40px;" no-spinner/>
                    </q-card-section>
                    <q-card-section class="q-py-sm q-px-xs">
                      <div class="text-subtitle1"><b>{{ lesson.title }}</b></div>
                      <q-chip v-if="lesson.progress > 0" class="q-ma-none" size="sm" text-color="white" color="dark-transparent-50"><b>Изучено: <span :class="lesson.progress > 0 ? ((lesson.progress == 100) ? 'text-positive' : 'text-warning') : ''">{{ lesson.progress }}%</span></b></q-chip>
                      <q-chip v-else-if="lesson.is_blocked" class="q-ma-none" size="sm" text-color="white" color="dark-transparent-50"><b>Премиум-планета</b></q-chip>
                      <q-chip v-else class="q-ma-none" size="sm" text-color="white" color="dark-transparent-50"><b>Не изучено</b></q-chip>
                    </q-card-section>
                    <q-btn v-if="lesson.is_blocked" round class="absolute-top-right" color="dark" icon="lock" push style="top: -5px; right: -5px; rotate: 15deg"></q-btn>
                  </q-card>
                </swiper-slide>
                <swiper-slide v-if="courseSection.total_lessons > courseSection.list.length" :key="`lessonIndex-100000`" :class="'text-center'">
                  <q-card flat
                      :class="`relative-position rounded-sm `" @click="router.push(`/explore-section-${courseSection.id}`)"
                      :style="`margin-top: 40px;`">
                    <q-card-section class="q-pb-none">
                      <q-avatar size="60px" class="bg-dark-transparent" >
                        <q-icon name="chevron_right"></q-icon>
                      </q-avatar>
                    </q-card-section>
                    <q-card-section class="q-py-sm q-px-xs">
                      <div class="text-caption"><b>Показать все</b></div>
                    </q-card-section>
                  </q-card>
                </swiper-slide>
              </swiper>
            </q-card-section>
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
    type: props.type
  }
  const courseSectionListResponse = await api.explore.getCourseSectionList(filter)
  if (courseSectionListResponse.error) {
    error.value = courseSectionListResponse
    courseSections.value = []
    return false;
  }
  courseSections.value = courseSectionListResponse
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

</style>
