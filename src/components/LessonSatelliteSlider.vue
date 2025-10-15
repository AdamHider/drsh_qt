<template>
  <div :class="`satellites non-selectable ${(lesson.active.satellites?.length > 1) ? 'has-orbit' : ''}`">
    <swiper
      v-if="lesson.active.id"
      :modules="[Navigation,EffectCreative]"
      :slides-per-view="props.slidesPerView"
      :centeredSlides="props.centerAligned"
      :navigation="props.navigation"
      @activeIndexChange="change"
      effect="creative"
      @swiper="onSwiper"
      :creativeEffect="{
          perspective: false,
          limitProgress: 4,
          speed: 200,
          prev: {
              translate: ['-70%', '20%', -100],
              rotate: [0, 0, -20],
              origin: 'center',
              scale: 0.5
          },
          next: {
              translate: ['70%', '20%', -100],
              rotate: [0, 0, 20],
              origin: 'center',
              scale: 0.5
          },
      }"
      style="margin-top: -150px;"    >
      <swiper-slide v-for="(satelliteItem, index) in lesson.active.satellites" :key="index"
        :class="`allow-overflow text-center ${(!satelliteItem.parent_id) ? 'main-lesson': 'satellite-lesson'} ${(satelliteItem.exercise && satelliteItem.exercise?.finished_at) ? 'lesson-finished' : 'lesson'} ${(satelliteItem.is_blocked === true) ? 'is-blocked' : ''}`"
        >
        <q-card flat class="transparent q-ma-sm satellite-block" :style="(!satelliteItem.parent_id && lesson.active.satellites?.length > 1) ? 'width: 160%; margin-top: -15%;' : ''">
            <q-card-section class="transparent no-shadow text-center q-pa-none satellite-image" style="min-height: 100px">
                <q-img
                    :src="satelliteItem.image"
                    no-spinner>
                </q-img>
            </q-card-section>
        </q-card>
      </swiper-slide>
    </swiper>
    </div>
</template>
<script setup>
import { useLesson } from '../composables/useLesson'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { ref, watch, toRefs, onMounted, onActivated } from 'vue'
import { EffectCreative } from 'swiper/modules';
import { playAudio } from 'src/services/audioService';

import 'swiper/css/effect-creative';
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

const swiperElement = ref(null)

const emits = defineEmits(['change'])

const props = defineProps({
  slidesPerView: Number,
  centerAligned: Boolean,
  slideHeight: String,
  navigation: Boolean,
  captionMode: String,
  activeSlide: Number
})
const activeSlide = toRefs(props).activeSlide

const { lesson } = useLesson()
const change = async (event) => {
  playAudio('swoosh')
  emits('change', event.activeIndex)
}
const swiperEl = ref(null)
const onSwiper = (swiper) => {
  swiperEl.value = swiper
}
onMounted(() => {
  if(swiperEl.value){
    setTimeout(() => {
      swiperEl.value.slideTo(activeSlide.value)
    }, 1000)
  }
})
watch(() => activeSlide.value, () => {
  swiperEl.value.slideTo(activeSlide.value)
})
</script>
<style scoped lang="scss">

.is-blocked{
  filter: grayscale(1) brightness(0.9);
}
.swiper.swiper-creative{
  overflow: visible;
  .swiper-slide{
    align-self: center;
  }
}
.satellites{
  max-width: 100vw;
  position: relative;
  .swiper-slide-active {
    .satellite-image{
      filter: drop-shadow(0px 0px 7px white);
      .q-img{
        filter: drop-shadow(0px 0px 7px rgba(255, 193, 22, 0.411));
      }
      &:before{
        opacity: 0.6;
      }
    }
  }
  .lesson-finished{
    .satellite-image .q-img:before{
      border-color: $positive !important;
      opacity: 0.5;
    }
  }
  .main-lesson{
    overflow: visible;
    .satellite-image .q-img:before{
      border-color: #00c3ff;
    }
    .q-img{
      filter: drop-shadow(0px 0px 7px #35adf4);
    }
  }
  .satellite-image{
    transition: 0.5s all;
    position: relative;
    &:before{
      content: "";
      position: absolute;
      top: 0%;
      right: 100%;
      width: 100%;
      height: 100%;
      transition: 0.5s all;
      opacity: 0;
    }
    .q-img{
      filter: drop-shadow(0px 0px 7px #35adf4);
      &:before{
        content: "";
        position: absolute;
        top: 3%;
        left: 3%;
        width: 94%;
        height: 94%;
        border-radius: 100%;
        opacity: 0.2;
        transition: 0.5s all;
        background: #0003;
      }
    }
  }
}
</style>
