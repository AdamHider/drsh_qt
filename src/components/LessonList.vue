<template>
  <div class="relative-position q-pb-md" style="z-index: 1;" ref="scrollAreaRef">
    <div v-for="(courseSection, courseSectionsIndex) in courseSections" :key="`courseSectionsIndex-${courseSectionsIndex}`"
        v-intersection="onIntersection"
        :courseSectionId="courseSection.data.id"
        :groupBackground="courseSection.data.background_image"
        :groupGradient="courseSection.data.background_gradient"
    >
      <div
        v-for="lesson in courseSection.list" :key="lesson.id"
        :class="`${lesson.type !== 'group' ? 'planet-block' : ''}  row q-px-sm ${lesson.order % 2 ? 'justify-end' : 'justify-start'} ${lesson.is_blocked === true ? 'is-blocked' : ''} ${lesson.is_initial ? 'is-initial' : ''}`"
      >
        <div :class="`col-6`" style="position: relative; z-index: 10">
          <transition
            appear
            enter-active-class="animated zoomIn"
            :leave-active-class="selectedLesson !== lesson.id ? 'animated planetBounceInactive' : 'animated planetBounceActive'"
          >
            <div v-if="transitionTrigger">
              <q-card flat :class="`bg-transparent justify-center q-ma-sm q-pa-sm q-pt-none column items-center`" @click="openLesson(lesson.id)">
                <q-card-section class="text-center self-center planet" style="width: 130px; min-height: 130px; margin: 0 auto">
                  <div v-if="lesson.satellites?.preview_list" class="satellite-list">
                    <div
                      v-for="(satellite, index) in lesson.satellites.preview_list" :key="index"
                      class="transparent satellite-item nopadding"
                      :style="{
                        animationDelay: `-${satellite.delay}s`,
                        animationDuration: `${satellite.duration}s`,
                        scale: `1.${satellite.distance / 2}`,
                      }"
                    >
                      <img
                        :src="satellite.image"
                        :style="{
                          width: `${satellite.size}px`,
                          top: `calc(-${satellite.size}px/2)`,
                          scale: `calc(-1.${satellite.distance} + 2)`,
                        }"
                      />
                    </div>
                  </div>
                  <q-img :src="lesson.image" class="planet-image" loading="lazy" no-spinner> </q-img>
                </q-card-section>
                <q-card-section class="text-center text-white q-pa-none absolute full-width"  style="top: 100%">
                  <div class="text-caption">
                    <span>Изучено: </span>
                    <b :class="lesson.progress > 0 && lesson.progress < 100 ? 'text-warning' : ''">{{ lesson.progress }}%</b>
                  </div>
                  <div class="text-bold">
                    <q-icon v-if="lesson.is_blocked === true" name="lock"></q-icon>
                    {{ lesson.title }}
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </transition>
        </div>
      </div>
      <q-card class="transparent text-white" flat>
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
      <q-separator style="border-bottom: 2px dashed white; opacity: 0.25;" />
    </div>
  </div>
  <q-page-sticky
    class="fixed full-width full-height"
    :style="`background: ${groupGradient}; transform: none`"
  >
    <q-img
      :src="groupBackground"
      class="absolute-top absolute-left full-width full-height"
      no-spinner
    />
  </q-page-sticky>

  <q-dialog
    v-model="lockDialog"
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card class="bg-white text-center" style="width: 300px">
      <q-card-section>
        <div class="text-h6">Пока недоступно</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        Сначала исследуйте предыдущую планету
      </q-card-section>
      <q-card-actions align="center" class="bg-white text-teal">
        <q-btn push class="col" color="primary" label="Понятно" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useLesson } from "../composables/useLesson";
import { ref, onActivated, onMounted, toRef, watch } from "vue";
import { useCourse } from "../composables/useCourse";
import { useRouter } from "vue-router";

const { lesson, getList, getListUpdates } = useLesson();
const { course } = useCourse();
const router = useRouter();

const groupBackground = ref(null);
const groupGradient = ref(null);
const selectedLesson = ref(0);
const currentCourseSectionId = ref(0);
const transitionTrigger = ref(false);
const inView = ref({});
const lockDialog = ref(false);
const courseSections = ref([])

const props = defineProps({
  disable: Boolean,
});
const disable = toRef(props, "disable");
const lessonList = ref([]);

const onLoad = async function () {
  await getList(1)
  composeList()

}
const composeList = () => {
  lessonList.value = [];

  const courseSectionsRaw = lesson.list.reduce((result, obj) => {
    result[obj.course_section_id] = result[obj.course_section_id] || {
        title: obj.course_section.title,
        description: obj.course_section.description,
        data: obj.course_section,
        expandDescription: false,
        list: []
      };
      result[obj.course_section_id].list.push(obj);
      return result;
  }, {})
  const courseSectionIds = Object.keys(courseSectionsRaw).reverse()
  for(var i in courseSectionIds){
    var couseSection = courseSectionsRaw[courseSectionIds[i]]
    couseSection.list[0].is_initial = true
    couseSection.list = couseSection.list.reverse()
    courseSections.value.push(couseSection)
  }
};
const checkGroup = (courseSection) => {
  if (courseSection.id != currentCourseSectionId.value) {
    currentCourseSectionId.value = courseSection.id;
    return true;
  }
  return false;
};
const openLesson = (lessonId) => {
  transitionTrigger.value = false;
  selectedLesson.value = lessonId;
  setTimeout(() => {
    router.push(`/lesson-startup-${selectedLesson.value}`);
  }, 250);
};
const onIntersection = (entry) => {
  if(entry.isIntersecting){
    inView.value[entry.target.attributes.courseSectionId?.value] = true;
    groupBackground.value = entry.target.attributes.groupBackground?.value;
    groupGradient.value = entry.target.attributes.groupGradient?.value;
  } else {
    inView.value[entry.target.attributes.courseSectionId?.value] = false;
  }
  console.log(inView.value)
  console.log(entry)
};
onMounted(async () => {
  transitionTrigger.value = true;
  selectedLesson.value = 0;
  onLoad()
});
onActivated(async () => {
  if (lesson.list.length > 0) {
    currentCourseSectionId.value = 0;
    transitionTrigger.value = true;
    selectedLesson.value = 0;
  }
  onLoad()
});
watch( () => course.active?.id, async () => {
  onLoad()
});
</script>
<style scoped lang="scss">
.planet-block {
  position: relative;
  &.is-initial {
    margin-bottom: 2em;
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
.satellite-item {
  position: absolute;
  top: 10%;
  left: 10%;
  height: 80%;
  width: 80%;
  z-index: 100;
  border-radius: 100%;
  border: 2px dashed #ffffff33;
  text-align: center;
  -webkit-animation: 16s linear 0s infinite sateliteRotate;
  animation: 16s linear infinite sateliteRotate;
}
.satellite-item img {
  position: absolute;
  -webkit-animation: 16s linear 0s infinite satelitePlanetRotate;
  animation: 16s linear 0s infinite satelitePlanetRotate;
}
@keyframes sateliteRotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes satelitePlanetRotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}
</style>
