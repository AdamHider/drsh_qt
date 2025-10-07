<template>
  <div class="video-container">
    <video playsinline autoplay height="100%" width="100%" @ended="emits('onEnded', true)">
      <source src="/videos/mektepium trailer.mp4" type="video/mp4" />
    </video>
    <q-card class="bg-transparent absolute-bottom full-width" flat>
      <q-card-actions class="justify-end">
        <q-btn flat color="white" icon-right="chevron_right" @click="emits('onEnded', true)" @click.stop="playAudio('click')"><b>Пропустить</b></q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { EffectFade, Autoplay } from 'swiper/modules';
import { playAudio } from 'src/services/audioService';


import 'swiper/css'
import 'swiper/css/effect-fade';

const modules = [ EffectFade, Autoplay ]
const emits = defineEmits(['onEnded'])

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

.video-container{
  position: relative;
  overflow: hidden;
}
.video-container video{
  min-width: 100%;
  height: 100%;
  -o-object-fit: cover;
  object-fit: cover;
}
video::-webkit-media-controls {
    display: none;
}

</style>
