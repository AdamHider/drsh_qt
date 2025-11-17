<template>
  <swiper
    :slidesPerView="props.slidesPerView"
    :spaceBetween="8"
    :slidesOffsetBefore="16"
    :slidesOffsetAfter="16"
  >
    <swiper-slide v-for="(lesson, lessonIndex) in dailyLessons" :key="`lessonIndex-${lessonIndex}`" :class="'text-center'">
      <q-card flat :class="`bg-transparent text-white text-shadow ${lesson.is_blocked ? 'is-blocked' : ''}`" @click="router.push(`/lesson-startup-${lesson.id}`)">
        <q-card-section class="q-pb-none q-px-none">
          <q-img class="planet-image allow-overflow" :src="lesson.image" width="80px" style="filter: drop-shadow(0px 0px 15px #35adf4);" no-spinner/>
        </q-card-section>
        <q-card-section class="q-pt-none q-px-xs" >
          <div class="text-subtitle1"><b>{{ lesson.title }}</b></div>
          <div class="text-sm" v-if="lesson.progress > 0">
            <b>Изучено: </b>
            <b :class="lesson.progress > 0 ? ((lesson.progress == 100) ? 'text-positive' : 'text-warning') : ''">{{ lesson.progress }}%</b>
          </div>
          <div class="text-sm text-grey-4" v-else>
            <b>Не изучено</b>
          </div>
        </q-card-section>
        <q-btn v-if="lesson.is_blocked" round class="absolute-top-right" color="dark" icon="lock" push style="top: -5px; right: -5px; rotate: 15deg"></q-btn>
      </q-card>
    </swiper-slide>
  </swiper>
</template>

<script setup>
import { ref, toRef, onMounted, onActivated, watch } from 'vue'
import { api } from '../services/index'
import { useRouter } from "vue-router";
import { Swiper, SwiperSlide } from 'swiper/vue'
import { playAudio } from 'src/services/audioService';

import 'swiper/css'

const router = useRouter();

const error = ref(false)

const dailyLessons = ref([])

const props = defineProps({
  activeOnly: Boolean,
  type: String,
  slidesPerView: Number,
  reloadTrigger: Boolean
})

const reloadTrigger = toRef(props, "reloadTrigger");

const load = async () => {
  const lessonListResponse = await api.explore.getList({type: props.type})
  if (lessonListResponse.error) {
    error.value = lessonListResponse
    dailyLessons.value = []
    return false;
  }
  dailyLessons.value = lessonListResponse.sort((a, b) => a.is_blocked ? 1 : -1);
}

onActivated(() => {
  //load()
})
onMounted(() => {
  load()
})

</script>
<style scoped lang="scss">
.is-blocked{
  filter: grayscale(1) brightness(0.9);
}
</style>
