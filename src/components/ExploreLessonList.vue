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
    <div v-for="(courseSection, courseSectionIndex) in courseSections" :key="`courseSectionIndex-${courseSectionIndex}`" >
        <q-card flat>
          <q-card-section class="q-py-none">
            <q-item class="q-px-none q-pb-none" clickable v-ripple :to="`explore-section-${courseSection.id}`">
              <q-item-section>
                <div class="text-subtitle1"><b>{{ courseSection.title }}</b></div>
                <div class="text-sm text-grey"><b>{{ courseSection.list.length }} {{ courseSection.subtitle }}</b></div>
              </q-item-section>
              <q-item-section side>
                <q-btn flat round icon="chevron_right"></q-btn>
              </q-item-section>
            </q-item>
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
                    :class="`q-push relative-position rounded-sm  text-white text-shadow ${lesson.is_blocked ? 'is-blocked' : ''}`" @click="router.push(`/lesson-startup-${lesson.id}`)"
                    :style="`margin-top: 30px; border-color: rgba(0, 0, 0, 0.7); background-image: linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0)), url(${(lesson.background_image) ? lesson.background_image : lesson.course_section.background_image}); background-size: cover; background-position: center;`">
                  <q-card-section class="q-pb-none">
                    <q-img class="planet-image allow-overflow" :src="lesson.image" width="100px" style="filter: drop-shadow(rgba(53, 173, 244, 0.62) 0px 5px 10px); margin-top: -40px;" no-spinner/>
                  </q-card-section>
                  <q-card-section class="q-py-sm q-px-xs">
                    <div class="text-subtitle1"><b>{{ lesson.title }}</b></div>
                    <q-chip v-if="lesson.progress > 0" class="q-ma-none" size="sm" text-color="white" color="dark-transparent-50"><b>Изучено: {{ lesson.progress }}%</b></q-chip>
                    <q-chip v-else-if="lesson.is_blocked" class="q-ma-none" size="sm" text-color="white" color="dark-transparent-50"><b>Премиум-планета</b></q-chip>
                    <q-chip v-else class="q-ma-none" size="sm" text-color="white" color="dark-transparent-50"><b>Не изучено</b></q-chip>
                  </q-card-section>
                  <q-btn v-if="lesson.is_blocked" round class="absolute-top-right" color="dark" icon="lock" push style="top: -5px; right: -5px; rotate: 15deg"></q-btn>
                </q-card>
              </swiper-slide>
              <swiper-slide :key="`lessonIndex-100000`" :class="'text-center'">
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
</template>

<script setup>
import { ref, toRef, onMounted, onActivated, reactive, watch } from 'vue'
import { api } from '../services/index'
import { useRouter } from "vue-router";
import { Swiper, SwiperSlide } from 'swiper/vue'
import { playAudio } from 'src/services/audioService';

import 'swiper/css'

const router = useRouter();


const error = ref(false)

const dialog = ref(false)
const activeCourseSection = ref({})

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
  const lessonListResponse = await api.explore.getList(filter)
  if (lessonListResponse.error) {
    error.value = lessonListResponse
    lessons.value = []
    composeList()
    return false;
  }

  lessons.value = lessonListResponse//.sort((a, b) => a.is_blocked ? 1 : -1);
  composeList()
  composeTags()
}

const composeList = () => {
  var result = []
  const courseSectionsRaw = lessons.value.reduce((result, obj) => {
    result[obj.course_section_id] = result[obj.course_section_id] || {
        ... obj.course_section, ...{ list: [] }
      };
      result[obj.course_section_id].list.push(obj);
      return result;
  }, {})
  const courseSectionIds = Object.keys(courseSectionsRaw)
  for(var i in courseSectionIds){
    var courseSection = courseSectionsRaw[courseSectionIds[i]]
    courseSection.subtitle = pluralHumanize(courseSection.list.length, ['планет','планета','планеты'])
    courseSection.list = courseSection.list
    result.push(courseSection)

  }
  courseSections.value = result
};

const composeTags = () => {
  tags.value = []
  let tagsRaw = []
  for(var i in lessons.value){
    tagsRaw = tagsRaw.concat(lessons.value[i].tags)
  }
  tagsRaw = tagsRaw.filter((item, pos) => tagsRaw.indexOf(item) === pos)
  tagsRaw = tagsRaw.sort((a, b) => (formData.tags.indexOf(b) > -1) ? 1 : -1);
  tags.value = tagsRaw
}

const addActiveTag = (tag) => {
  if(formData.tags.indexOf(tag) > -1){
    formData.tags = formData.tags.filter((item) => item !== tag)
  } else {
    formData.tags.push(tag)
  }
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
