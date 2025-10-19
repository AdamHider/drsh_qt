<template>
  <div v-if="isActive" class="background-overlay" @click="select(0)"></div>
  <div :class="`col-6 ${(isActive) ? 'is-active' : ''} ${lessonItem.is_blocked === true ? 'is-blocked' : ''}`" style="position: relative; z-index: 10">
    <div v-if="lessonItem.scroll_anchor" id="scrollAnchor"></div>
    <transition
      appear
      enter-active-class="animated zoomIn"
      :leave-active-class="selectedLesson !== lessonItem.id ? 'animated planetBounceInactive' : 'animated planetBounceActive'"
    >
      <div v-if="transitionTrigger">
        <q-card flat :class="`bg-transparent justify-center q-ma-sm q-pa-sm q-pt-none column items-center`" tabindex="-1" @click="select(lessonItem.id)">
          <q-card-section class="text-center self-center planet" style="width: 130px; min-height: 130px; margin: 0 auto">
            <div v-if="lessonItem.satellites.length > 0" class="satellite-list">


              <div class="satelites-circle"></div>
              <div
                v-for="(satellite, index) in lessonItem.satellites" :key="index"
                class="transparent satellite-item nopadding"
                :style="{
                  transform: `rotate(${satellite.rotation}deg)`,
                }"
              >
                <img
                  :src="satellite.image"
                  :style="{
                    width: `${satellite.size}px`,
                    marginLeft: `-${satellite.size/2}px`,
                    marginTop: `-${satellite.size/2}px`,
                    rotate: `${(lessonIndex % 2) ? 90-satellite.rotation : (90+satellite.rotation)*-1}deg`
                  }"
                />
              </div>
            </div>
            <q-img :src="lessonItem.image" class="planet-image" loading="lazy" no-spinner> </q-img>
          </q-card-section>
          <q-card-section class="text-center text-white q-pa-none absolute full-width"  style="top: 100%" >
            <div class="text-caption">
              <span>Изучено: </span>
              <b :class="lessonItem.progress > 0 ? ((lessonItem.progress == 100) ? 'text-positive' : 'text-warning') : ''">{{ lessonItem.progress }}%</b>
            </div>
            <div class="text-bold">
              <q-icon v-if="lessonItem.is_blocked === true" name="lock"  class="q-mr-xs"></q-icon>
              <q-avatar v-if="lessonItem.is_quest === true" size="18px" font-size="12px" color="secondary" text-color="white" icon="priority_high" class="vertical-middle q-mr-xs" style="box-shadow: rgba(255, 255, 255, 0.51) 0px 0px 0px 2px inset;"/>
              <span class="vertical-middle">{{ lessonItem.title }}</span>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { useLesson } from "../composables/useLesson";
import { ref, onActivated, onMounted, toRef, watch } from "vue";
import { useCourse } from "../composables/useCourse";
import { useLoader } from '../composables/useLoader'
import { useRouter } from "vue-router";

const { lesson, getList } = useLesson();

const emits = defineEmits(['onSelected'])


const selectedLesson = ref(0);
const transitionTrigger = ref(false);

const props = defineProps({
  lessonItem: Object,
  lessonIndex: Number,
  isActive: Boolean
});
const lessonItem = toRef(props, "lessonItem");
const lessonIndex = toRef(props, "lessonIndex");
const isActive = toRef(props, "isActive");

const select = (lessonId) => {
  emits('onSelected', lessonId)
}
onMounted(async () => {
  transitionTrigger.value = true;
  selectedLesson.value = 0;
});
onActivated(async () => {
  if (lesson.list.length > 0) {
    transitionTrigger.value = true;
    selectedLesson.value = 0;
  }
});
</script>
<style scoped lang="scss">
.planet-block {
  position: relative;
  &.is-initial {
    margin-bottom: 3em;
  }
  &:not(.is-initial) {
    &:before {
      content: "";
      position: absolute;
      top: 50%;
      left: 25%;
      height: 100%;
      z-index: 0;
      width: 50%;
      transform-origin: right top;
      background: url("/images/dotted_line_right.png");
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center center;
    }
    &.justify-end {
      &:before {
        content: "";
        position: absolute;
        top: 50%;
        left: 25%;
        height: 100%;
        z-index: 0;
        width: 50%;
        transform-origin: right top;
        background: url("/images/dotted_line_left.png");
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center center;
      }
    }
  }
  .planet-image{
    transition: 0.5s all ease;
    filter: drop-shadow(0px 0px 15px #35adf4);
  }
}
.is-blocked{
  .satellite-item ,
  .planet-image{
    filter: grayscale(1) brightness(0.9);
  }
  &:before {
    opacity: 0.3;
  }
}
.background-overlay{
  position: fixed;
  background: black;
  opacity: 0.5;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
}
.is-active{
  position: relative;
  z-index: 1000 !important;
  .satellite-list{
    scale: 2.5;
    .satelites-circle{
      border-color: #fff;
      border-style: solid;
      box-shadow: 0px 0px 5px 0 orange, inset 0px 0px 5px 0 orange;
    }
    .satellite-item img {
      scale: 1.4;
    }
  }
  .planet-image{
    scale: 1.6;
  }
}
.satellite-list{
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  border-radius: 100%;
  rotate: 90deg;
  scale: 1;
  transition: 0.5s all ease;
  .satelites-circle{
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    border-radius: 100%;
    border: 2px dashed #ffffff33;
    -webkit-animation: 16s linear 0s infinite satelitePlanetRotate;
    animation: 16s linear infinite sateliteRotate;
  }
  .satellite-item {
    position: absolute;
    top: 0%;
    left: 0%;
    height: 100%;
    width: 100%;
    z-index: 100;
    border-radius: 100%;
    text-align: center;
    /*-webkit-animation: 16s linear 0s infinite sateliteRotate;
    animation: 16s linear infinite sateliteRotate;*/
    img {
      position: absolute;
      /*filter: drop-shadow(0px 0px 8px #35adf4);*/
    /* -webkit-animation: 16s linear 0s infinite satelitePlanetRotate;
      animation: 16s linear 0s infinite satelitePlanetRotate;*/
    }
  }
}
.justify-end .satellite-list{
  rotate: -90deg;
}
@keyframes sateliteRotate {
  0% {
    transform: rotate(0deg) translateZ(2px);
  }
  100% {
    transform: rotate(360deg) translateZ(2px);
  }
}
@keyframes satelitePlanetRotate {
  0% {
    transform: rotate(0deg) translateZ(2px);
  }
  100% {
    transform: rotate(-360deg) translateZ(2px);
  }
}
</style>
