<template>
      <q-infinite-scroll ref="infiniteList" scroll-taget="scroll-area" @load="onLoad" reverse class="relative-position" style="z-index: 1; " >
          <template v-slot:loading>
              <div class="row justify-center q-my-md">
              <q-spinner color="primary" name="dots" size="40px" />
              </div>
          </template>
          <div v-for="(lesson, index) in lesson.list" :key="index"
              :class="`row q-px-lg ${(lesson.order % 2) ? 'justify-start' : 'justify-end'}`"
              v-intersection="onIntersection"
              :groupBackground="lesson.parent_description.background_image"
              :groupGradient="lesson.parent_description.background_gradient"
          >
              <div :class="`col-auto`">
                  <q-card class="transparent no-shadow q-ma-sm">
                      <q-card-section class="transparent no-shadow text-center" style="width: 130px; min-height: 130px">

                          <div v-if="lesson.satellites?.preview_list"
                            class="satellite-list">
                              <div v-for="(satellite, index) in lesson.satellites.preview_list" :key="index"
                                class="transparent satellite-item nopadding"
                                :style="{
                                  animationDelay: `-${satellite.delay}s`,
                                  animationDuration: `${satellite.duration}s`,
                                  scale: `1.${satellite.distance}`
                              }">
                                  <img
                                    class="ui circular mini image"
                                    :src="`${CONFIG.API_HOST}/${satellite.image}`"
                                    :style="{
                                      width: `${satellite.size}px`,
                                      top: `calc(-${satellite.size}px/2)`,
                                      scale: `calc(-1.${satellite.distance} + 2)`
                                    }"
                                    />
                              </div>
                          </div>
                          <q-img
                              :src="`${CONFIG.API_HOST}/${lesson.image}`"
                              loading="lazy"
                              spinner-color="white"/>
                      </q-card-section>
                      <q-card-section class="text-center text-white q-pa-none">
                          <div class="text-bold">{{lesson.intro?.subtitle}}</div>
                          <div class="row q-ma-sm">
                              <div class="col text-left"></div>
                              <div class="col  text-right">
                                  <b>{{lesson.exercise?.current_page}}</b>
                              </div>
                          </div>
                      </q-card-section>
                  </q-card >
              </div>
              </div>
      </q-infinite-scroll>
    <q-page-sticky
      class="fixed full-width full-height"
      :style="`background: ${groupGradient}; transform: none`"
     >
      <q-img
        :src="`${CONFIG.API_HOST}/${groupBackground}`"
        class="absolute-top absolute-left full-width full-height"
        loading="lazy"
        spinner-color="white"
      />
    </q-page-sticky>
</template>

<script setup>
import { useLesson } from '../composables/useLesson'
import { CONFIG } from '../config.js'
import { ref, onActivated, onDeactivated, toRef } from 'vue'

const { lesson, getList } = useLesson()

const groupBackground = ref(null)
const groupGradient = ref(null)
const infiniteList = ref(null)

const props = defineProps({
  disable: Boolean
})
const disable = toRef(props, 'disable')

const onLoad = async function (index, done) {
  if (disable.value) return false
  const isDone = await getList(index)
  done(isDone)
}
const onIntersection = (entry) => {
  groupBackground.value = entry.target.attributes.groupBackground.value
  groupGradient.value = entry.target.attributes.groupGradient.value
}
onDeactivated(() => {
})
onActivated(() => {
})
</script>
<style scoped>

.satellite-item{
    position: absolute;
    top: 10%;
    left: 10%;
    height: 80%;
    width: 80%;
    z-index: 100;
    border-radius: 100%;
    border: 1px solid #ffffff29;
    text-align: center;
    -webkit-animation: 8s linear 0s infinite sateliteRotate;
    animation: linear infinite sateliteRotate;
}
.satellite-item img{
  position: absolute;
  -webkit-animation: 8s linear 0s infinite satelitePlanetRotate;
  animation: 8s linear 0s infinite satelitePlanetRotate;
}
@keyframes sateliteRotate {
  0%   {transform: rotate(0deg);}
  100% {transform: rotate(360deg);}
}
@keyframes satelitePlanetRotate {
  0%   {transform: rotate(0deg);}
  100% {transform: rotate(-360deg);}
}
</style>
