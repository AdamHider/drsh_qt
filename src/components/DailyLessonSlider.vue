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
        </q-card-section>
        <q-btn v-if="lesson.is_blocked" round class="absolute-top-right" color="dark" icon="lock" push style="top: -5px; right: -5px; rotate: 15deg"></q-btn>
      </q-card>
    </swiper-slide>
  </swiper>
</template>

<script setup>
import { ref, toRef, onMounted, onActivated, watch } from 'vue'
import { useExplore } from '../composables/useExplore'
import { useRouter } from "vue-router";
import { Swiper, SwiperSlide } from 'swiper/vue'
import { playAudio } from 'src/services/audioService';

import 'swiper/css'

const router = useRouter();

const { explore, getList  } = useExplore()

const error = ref(false)

const dailyLessons = ref([])
const unexploredCount = ref(0)

const props = defineProps({
  activeOnly: Boolean,
  type: String,
  slidesPerView: Number,
  reloadTrigger: Boolean
})

const reloadTrigger = toRef(props, "reloadTrigger");

const load = async () => {
  const lessonListResponse = await getList({type: props.type})
  if (lessonListResponse.error) {
    error.value = lessonListResponse
    dailyLessons.value = []
    return false;
  }
  dailyLessons.value = lessonListResponse.sort((a, b) => a.is_blocked ? 1 : -1);

  unexploredCount.value = dailyLessons.value.filter(function(item){
    return !item.is_blocked && !item.is_explored;
  }).length;
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
.daily-lesson-avatar{
  &.lesson{
    box-shadow: inset 0 0 0 2px $yellow;
  }
  &.unexplored:before{
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-shadow: 0 0 0 1px $secondary;
    border-radius: inherit;
    animation: pulseSignal 1.5s ease infinite;

  }
  &.unexplored:after{
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-shadow: 0 0 0 1px $secondary;
    border-radius: inherit;
    animation: pulseSignal 1.5s ease 0.2s infinite;
  }
}

@keyframes pulseSignal {
  0%{
    transform: scale(1);
    opacity: 1;
  }
  50%, 100%{
    transform: scale(1.5);
    opacity: 0;
  }
}
@keyframes pulseSignalShadow {
  0%{
    filter: drop-shadow(0 0 5px $yellow)
  }
  100%{
    filter: drop-shadow(0 0 0px $yellow)
  }
}


</style>
