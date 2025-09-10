<template>
  <div v-if="lesson.list.length > 0" style="height: 0px;">
      <div v-for="(satelliteItem, index) in lesson.list" :key="`satelliteItemImage${index}`">
      <img :src="satelliteItem.image" width="1px"/>
      <img :src="satelliteItem.course_section.background_image" width="1px"/>
    </div>
  </div>
  <transition
    appear
    enter-active-class="animated fadeInUp"
    leave-active-class="animated fadeOutDown">
    <div class="relative-position" style="z-index: 1;" v-if="transitionTrigger">
      <q-card class="transparent text-white q-mb-md" flat>
        <q-card-section>
          <div class="text-subtitle1">
            <b>Новые миры</b>
          </div>
          <div class="text-caption">
            Уже очень скоро
          </div>
        </q-card-section>
      </q-card>
      <q-separator class="section-separator" style="margin: 24px 0 48px; border-bottom: 2px dashed white; opacity: 0.25;" />
      <div v-for="(courseSection, courseSectionsIndex) in courseSections" :key="`courseSectionsIndex-${courseSectionsIndex}`"
          v-intersection="onIntersection"
          :groupKey="courseSectionsIndex"
          class="section-block">
        <div v-for="(lessonItem, lessonIndex) in courseSection.list" :key="`lessonIndex${lessonIndex}`"
          :class="`planet-block row q-px-sm q-py-md ${lessonIndex % 2 ? 'justify-end' : 'justify-start'} ${lessonItem.is_blocked === true ? 'is-blocked' : ''} ${lessonItem.is_initial ? 'is-initial' : ''}`"
        >
          <div :class="`col-6`" style="position: relative; z-index: 10">
            <div v-if="lessonItem.scroll_anchor" id="scrollAnchor"></div>
            <div>
              <q-card flat :class="`bg-transparent justify-center q-ma-sm q-pa-sm q-pt-none column items-center`" @click="openLesson(lessonItem.id)">
                <q-card-section class="text-center self-center planet" style="width: 130px; min-height: 130px; margin: 0 auto">
                  <div v-if="lessonItem.satellites.length > 0" class="satellite-list">
                    <div class="satelites-circle"></div>
                    <div
                      v-for="(satellite, index) in lessonItem.satellites" :key="index"
                      class="transparent satellite-item nopadding"
                      :style="{
                        transform: `rotate(${satellite.rotation}deg)`,
                      }">
                      <img
                        :src="satellite.image"
                        :style="{
                          width: `${satellite.size}px`,
                          marginLeft: `-${satellite.size/2}px`,
                          marginTop: `-${satellite.size/2}px`,
                          rotate: `${(lessonIndex % 2) ? 90-satellite.rotation : (90+satellite.rotation)*-1}deg`
                        }"/>
                    </div>
                  </div>
                  <q-img :src="lessonItem.image" class="planet-image" loading="lazy" no-spinner> </q-img>
                </q-card-section>
                <q-card-section class="text-center text-white q-pa-none absolute full-width"  style="top: 100%">
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
          </div>
        </div>
        <q-card class="transparent text-white q-mb-md" flat>
          <q-card-section>
            <div class="text-subtitle1">
              <b>Система "{{ courseSection.title }}"</b>
            </div>
            <div :class="`text-caption satellite-description ${(courseSection.expandDescription) ? '': 'max-two-lines'}`" @click="courseSection.expandDescription = !courseSection.expandDescription">
              {{courseSection.description}}
            </div>
            <div class="text-caption" @click="courseSection.expandDescription = !courseSection.expandDescription">
              <b v-if="courseSection.expandDescription">Свернуть <q-icon name="keyboard_arrow_up"></q-icon></b>
              <b v-else>Показать ещё <q-icon name="keyboard_arrow_down"></q-icon></b>
            </div>
          </q-card-section>
        </q-card>
        <q-separator class="section-separator" style="border-bottom: 2px dashed white; opacity: 0.25;" />
      </div>
    </div>
    <div v-else>
      <q-spinner-puff size="50px" color="white" />
    </div>
  </transition>
  <div ref="bottomPoint" class="bottomPoint" style="margin-top: 60px;"></div>
  <q-page-sticky class="fixed full-width full-height" >
    <q-img :src="activeCourseSection.background_image" class="absolute-top absolute-left full-width full-height" no-spinner/>
  </q-page-sticky>
</template>

<script setup>
import { useLesson } from "../composables/useLesson";
import { ref, onActivated, onMounted, toRef, watch } from "vue";
import { useCourse } from "../composables/useCourse";
import { useLoader } from '../composables/useLoader'
import { useRouter } from "vue-router";
import { useAudio } from '../composables/useAudio'

const { playAudio } = useAudio()

const { lesson, getList } = useLesson();
const { course } = useCourse();
const { showLoader, hideLoader } = useLoader()

const router = useRouter();

const bottomPoint = ref(null);
const activeCourseSection = ref({})
const selectedLesson = ref(0);
const transitionTrigger = ref(false);
const inView = ref({});
const courseSections = ref([])

const props = defineProps({
  disable: Boolean,
  reloadTrigger: Boolean
});
const disable = toRef(props, "disable");
const reloadTrigger = toRef(props, "reloadTrigger");

const load = async function () {
  await getList()
  composeList()
  hideLoader()
}
const composeList = () => {
  var result = []
  checkScrollAnchor()
  const courseSectionsRaw = lesson.list.reduce((result, obj) => {
    result[obj.course_section_id] = result[obj.course_section_id] || {
        ... obj.course_section, ...{ expandDescription: false, list: [] }
      };
      result[obj.course_section_id].list.push(obj);
      return result;
  }, {})
  const courseSectionIds = Object.keys(courseSectionsRaw).reverse()

  for(var i in courseSectionIds){
    var couseSection = courseSectionsRaw[courseSectionIds[i]]
    couseSection.list[0].is_initial = true

    couseSection.list = couseSection.list.reverse()
    result.push(couseSection)

  }
  courseSections.value = result
};
const checkScrollAnchor = () => {
  if(lesson.list.filter((item) => item.scroll_anchor).length > 0) return
  for(var i in lesson.list){
    if(lesson.list[i*1+1]?.is_blocked == true){
      lesson.list[i].scroll_anchor = true
      break
    }
  }
}
const openLesson = (lessonId) => {
  playAudio('click_planet')
  transitionTrigger.value = false;
  selectedLesson.value = lessonId;
  //setTimeout(() => {
    router.push(`/lesson-startup-${selectedLesson.value}`);
    transitionTrigger.value = true;
  //}, 250);
};
const onIntersection = (entry) => {
  const groupIndex = entry.target.attributes.groupKey?.value
  if(entry.isIntersecting){
    inView.value[groupIndex] = true;
  } else {
    inView.value[groupIndex] = false;
  }
  for(var i in inView.value){
    if(inView.value[i]) activeCourseSection.value = courseSections.value[i];
  }
};
onMounted(async () => {
  selectedLesson.value = 0;
  await load()
  setTimeout(() => {
    if(document.querySelector('#scrollAnchor')) document.querySelector('#scrollAnchor').scrollIntoView({block: "center", behavior: "smooth"})
    else if(bottomPoint.value) bottomPoint.value.scrollIntoView()
  }, 250);
  onImagesRendered(() => {
    transitionTrigger.value = true
  })
});
const onImagesRendered = (callback) => {
  const images = [...document.querySelectorAll(".q-page img")];
  images.map(im=>new Promise(res=>
    im.onload = callback
  ))
}
onActivated(async () => {
  if (lesson.list.length > 0) {
    transitionTrigger.value = true;
    selectedLesson.value = 0;
  }
  await load()
});
watch( () => course.active?.id, async () => {
  load()
});
watch(() => reloadTrigger.value, () => {
  load()
})
</script>
<style scoped lang="scss">
.section-block{
  .section-separator{
    display: none;
  }
  &:not(:last-child){
    .section-separator{
      display: block;
    }
  }
}
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
    filter: drop-shadow(0px 0px 15px #35adf4);
  }
  &.is-blocked {
    filter: grayscale(1) brightness(0.9);
    &:before {
      opacity: 0.3;
    }
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
}
.justify-end .satellite-list{
  rotate: -90deg;
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
}
.satellite-item img {
  position: absolute;
  filter: drop-shadow(0px 0px 8px #35adf4);
 /* -webkit-animation: 16s linear 0s infinite satelitePlanetRotate;
  animation: 16s linear 0s infinite satelitePlanetRotate;*/
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
