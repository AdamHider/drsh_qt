<template>
  <div class="satellites non-selectable">
    <swiper
      v-if="lesson.active.id"
      :modules="[Navigation,EffectCreative]"
      :slides-per-view="props.slidesPerView"
      :centeredSlides="props.centerAligned"
      :navigation="props.navigation"
      @activeIndexChange="change"
      effect="creative"
      :creativeEffect="{
          perspective: false,
          limitProgress: 4,
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
      style="padding-bottom: 50px;"
    >
      <swiper-slide v-for="(satelliteItem, index) in lesson.active.satellites?.list" :key="index"
        :class="`text-center ${(!satelliteItem.parent_id) ? 'main-lesson': 'satellite-lesson'} ${(satelliteItem.exercise && satelliteItem.exercise?.finished_at) ? 'lesson-finished' : 'lesson'}`"
        @click="select(index)">
        <q-card flat class="transparent q-ma-sm"
            :disabled="satelliteItem.is_blocked ? true : null">
            <q-btn v-if="satelliteItem.is_blocked === true"
                color="white"
                text-color="dark"
                class="absolute-top"
                style="top: 10px; left: 10px; z-index: 5"
                round
                icon="lock"
            ></q-btn>
            <q-card-section class="transparent no-shadow text-center q-pa-none satellite-image" style="min-height: 100px">
                <q-img
                    :src="satelliteItem.image"
                    loading="lazy"
                    spinner-color="white">
                </q-img>
            </q-card-section>
            <q-card-section class="text-center text-white q-pa-none">
              <q-chip v-if="satelliteItem.parent_id" dense :color="(satelliteItem.exercise && satelliteItem.exercise?.finished_at) ? 'positive': (satelliteItem.exercise) ? 'orange' : 'dark'" text-color="white" class="q-pa-xs q-px-sm"
                :icon="(satelliteItem.exercise && satelliteItem.exercise?.finished_at) ? 'done' : (satelliteItem.exercise) ? 'hourglass_top' : 'stop'">
                <b>Спутник</b>
              </q-chip>
              <q-chip v-else dense :color="(satelliteItem.exercise && satelliteItem.exercise?.finished_at) ? 'positive': (satelliteItem.exercise) ? 'orange' : 'dark'" text-color="white" class="q-pa-xs q-px-sm"
                style="position: absolute; transform: translate3D(0%,400%,0) rotate(20deg);transform-origin: top;"
                :icon="(satelliteItem.exercise && satelliteItem.exercise?.finished_at) ? 'done' : (satelliteItem.exercise) ? 'hourglass_top' : 'stop'">
                <b>Планета</b></q-chip>
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
import { EffectCreative } from 'swiper/modules';
import 'swiper/css/effect-creative';
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

const emits = defineEmits(['select','change'])

const props = defineProps({
  slidesPerView: Number,
  centerAligned: Boolean,
  slideHeight: String,
  navigation: Boolean,
  captionMode: String
})

const { lesson } = useLesson()
const select = async (index) => {
  emits('select', index)
}
const change = async (event) => {
  emits('change', event.activeIndex)
}
</script>
<style scoped lang="scss">
.swiper.swiper-creative{
  overflow: visible;
}
.satellites{
  margin-top: 100px;
  max-width: 100vw;
  position: relative;
  .satellite-lesson{

  }
  &:before{
    content: "";
    position: absolute;
    top: 40vw;
    left: -40vw;
    width: 180vw;
    height: 180vw;
    border-radius: 100%;
    border: 1px solid white;
    opacity: 0.6;
  }
  .swiper-slide-active {
    .satellite-image{
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
      scale: 2;
      transform: translateX(24%);
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
    .q-img:before{
      content: "";
      position: absolute;
      top: 3%;
      left: 3%;
      width: 94%;
      height: 94%;
      border-radius: 100%;
      border: 1px solid white;
      opacity: 0.2;
      transition: 0.5s all;
      background: #0003;
    }
  }
}
</style>
