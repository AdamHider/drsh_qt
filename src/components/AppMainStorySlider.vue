<template>
    <swiper
      :slides-per-view="props.slidesPerView"
      :centeredSlides="props.centerAligned"
      :autoplay="{
        delay: 9000,
        disableOnInteraction: false,
        stopOnLastSlide: true
      }"
      :crossFade="true"
      :allowTouchMove="false"
      :modules="modules"
      :effect="'fade'"
    >
      <swiper-slide  v-for="(slide, index) in slides" :key="`story-slide-${index}`">
        <q-card flat class="story-card full-height no-border-radius column justify-end">
            <q-img class="story-image absolute-full" :src="slide.image"/>
            <q-card-section style="z-index: 2">
              <div class="bg-dark-transparent text-white text-center text-subtitle1"><b>
                {{ slide.text }}
              </b></div>
            </q-card-section>
            <q-card-actions  style="z-index: 2" class="justify-end text-right">
              <q-btn flat color="white" icon-right="chevron_right"><b>Next</b></q-btn>
            </q-card-actions>
        </q-card>
      </swiper-slide>
    </swiper>
</template>
<script setup>
import { api } from '../services/index'
import { ref, onMounted, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { EffectFade, Autoplay } from 'swiper/modules';


import 'swiper/css'
import 'swiper/css/effect-fade';

const modules = [ EffectFade, Autoplay ]

const props = defineProps({
  slidesPerView: Number,
  centerAligned: Boolean,
  withButton: Boolean,
  slideHeight: String,
  navigation: Boolean,
  captionMode: String
})
const slides = ref([])

slides.value = [
  {
    image: '/images/story/1.jpg',
    text: 'Hello'
  },
  {
    image: '/images/story/2.jpg',
    text: 'Hello'
  },
  {
    image: '/images/story/3.jpg',
    text: 'Hello'
  }
];

</script>
<style scoped>
.swiper-slide-active .story-image{
  z-index: 1;
  animation: scaleUp 10s linear;
  animation-fill-mode: forwards;
}
.swiper-slide.swiper-slide-prev .story-image{
  animation: scaleUp 10s linear;
  animation-fill-mode: forwards;
}
.story-card{
  max-height: 100vh;
  overflow: hidden;
}
.story-card .story-image{
}
@keyframes scaleUp {
  0% {transform: scale(1)}
  100% {transform: scale(1.2)}
}

</style>
