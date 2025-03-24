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
      @swiper="onSwiper"
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
      <swiper-slide v-for="(satelliteItem, index) in lesson.active.satellites?.list" :key="index" ref
        :class="`text-center ${(!satelliteItem.parent_id) ? 'main-lesson': 'satellite-lesson'} ${(satelliteItem.exercise && satelliteItem.exercise?.finished_at) ? 'lesson-finished' : 'lesson'} ${(satelliteItem.is_blocked === true) ? 'is-blocked' : ''}`"
        >
        <q-card flat class="transparent q-ma-sm" :style="(!satelliteItem.parent_id) ? 'width: 200%; margin-top: -50%;' : ''">
            <q-card-section class="transparent no-shadow text-center q-pa-none satellite-image" style="min-height: 100px">
                <q-img
                    :src="satelliteItem.image"
                    loading="lazy"
                    spinner-color="white">
                </q-img>
            </q-card-section>
            <q-card-section class="text-center text-white q-pa-none">
              <div :style="(!satelliteItem.parent_id) ? 'position: absolute; transform: translate3d(100%, -50%, 0px) rotate(22deg); transform-origin: top;' : ''">
                <q-chip dense :color="(satelliteItem.exercise && satelliteItem.exercise?.finished_at) ? 'positive': (satelliteItem.exercise) ? 'orange' : 'dark'"
                  text-color="white" class="q-pa-xs q-px-sm">
                  <q-icon v-if="satelliteItem.is_blocked" name="lock"/>
                  <q-icon v-else-if="(satelliteItem.exercise && satelliteItem.exercise?.finished_at)" name="done"/>
                  <q-icon v-else-if="(satelliteItem.exercise && !satelliteItem.exercise?.finished_at)" name="hourglass_top"/>
                  <q-icon v-else-if="!satelliteItem.exercise" name="stop"/>
                  <b> {{ satelliteItem.title }}</b>
                </q-chip>
                <div class="text-caption" v-if="satelliteItem.parent_id">Спутник</div>
                <div class="text-caption" v-else>Планета</div>
              </div>
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
  emits('change', event.activeIndex)
}
const swiperEl = ref(null)
const onSwiper = (swiper) => {
  swiperEl.value = swiper
}
onMounted(() => {
  if(swiperEl.value) swiperEl.value.slideTo(activeSlide.value)
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
}
.satellites{
  margin-top: 100px;
  max-width: 100vw;
  position: relative;
  &:before{
    content: "";
    position: absolute;
    top: 40vw;
    left: -40vw;
    width: 180vw;
    height: 180vw;
    border-radius: 100%;
    border: 2px dashed white;
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
