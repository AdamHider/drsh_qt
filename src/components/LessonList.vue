<template>
  <q-infinite-scroll ref="infiniteList" scroll-taget="scroll-area" @load="onLoad" reverse class="relative-position q-pb-md" style="z-index: 1;padding-top: 50px">
        <template v-slot:loading>
            <div class="row justify-center q-my-md">
            <q-spinner color="primary" name="dots" size="40px" />
            </div>
        </template>
    <div
      v-for="lesson in lessonList"
      :key="lesson.id"
      :class="`${lesson.type !== 'group' ? 'planet-block' : ''}  row q-px-sm ${
        lesson.order % 2 ? 'justify-end' : 'justify-start'
      } ${lesson.is_blocked === true ? 'is-blocked' : ''} ${
        lesson.is_initial ? 'is-initial' : ''
      }`"
      v-intersection="onIntersection"
      :groupBackground="lesson.course_section.background_image"
      :groupGradient="lesson.course_section.background_gradient"
      :lessonId="lesson.id"
    >
      <transition
        appear
        enter-active-class="animated fadeInUp"
        leave-active-class="animated fadeOutDown"
      >
        <div v-if="transitionTrigger" class="full-width">
          <q-card
            v-if="lesson.type == 'group'"
            class="transparent text-white"
            flat
          >
            <q-card-section>
              <div class="text-h6">
                <b>{{ lesson.course_section.title }}</b>
              </div>
              <div class="text-caption">
                {{ lesson.course_section.description }}
              </div>
            </q-card-section>
            <q-separator color="white" />
          </q-card>
        </div>
      </transition>
      <div
        v-if="lesson.type !== 'group'"
        :class="`col-6`"
        style="position: relative; z-index: 10"
      >
        <transition
          appear
          enter-active-class="animated zoomIn"
          :leave-active-class="
            selectedLesson !== lesson.id
              ? 'animated planetBounceInactive'
              : 'animated planetBounceActive'
          "
        >
          <div v-if="transitionTrigger">
            <q-card
              flat
              :class="`bg-transparent justify-center q-ma-sm q-pa-sm q-pt-none column items-center`"
              @click="openLesson(lesson.id)"
            >
              <q-card-section
                class="text-center self-center planet"
                style="width: 130px; min-height: 130px; margin: 0 auto"
              >
                <div
                  v-if="lesson.satellites?.preview_list"
                  class="satellite-list"
                >
                  <div
                    v-for="(satellite, index) in lesson.satellites.preview_list"
                    :key="index"
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
              <q-card-section
                class="text-center text-white q-pa-none absolute full-width"
                v-if="inView[lesson.id]"
                style="top: 100%"
              >
                <div class="text-caption">
                  <span>Изучено:</span>
                  <b
                    :class="
                      lesson.progress > 0 && lesson.progress < 100
                        ? 'text-warning'
                        : ''
                    "
                    >{{ lesson.progress }}%</b
                  >
                </div>
                <div class="text-bold">
                  <q-icon
                    v-if="lesson.is_blocked === true"
                    name="lock"
                  ></q-icon>
                  {{ lesson.title }}
                </div>
              </q-card-section>
            </q-card>
          </div>
        </transition>
      </div>
    </div>
  </q-infinite-scroll>
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
const infiniteList = ref(null);
const selectedLesson = ref(0);
const currentCourseSectionId = ref(0);
const transitionTrigger = ref(false);
const inView = ref({});
const lockDialog = ref(false);

const props = defineProps({
  disable: Boolean,
});
const disable = toRef(props, "disable");
const lessonList = ref([]);

const onLoad = async function (index, done) {
  if (disable.value) return false
  currentCourseSectionId.value = 0
  const isDone = await getList(index)
  if (!isDone) composeList()
  done(isDone)
}
const composeList = () => {
  lessonList.value = [];
  for (let i = lesson.list.length - 1; i >= 0; i--) {
    if (checkGroup(lesson.list[i] && lesson.list[i].course_section)) {
      lesson.list[i].is_initial = true;
      lessonList.value.unshift({
        ...{ course_section: lesson.list[i].course_section },
        ...{ type: "group" },
      });
    }
    lessonList.value.unshift({ ...lesson.list[i], ...{ type: "lesson" } });
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
  groupBackground.value = entry.target.attributes.groupBackground?.value;
  groupGradient.value = entry.target.attributes.groupGradient?.value;
  setTimeout(() => {
    inView.value[entry.target.attributes.lessonId?.value] = true;
  }, 0);
};
onMounted(async () => {
  transitionTrigger.value = true;
  selectedLesson.value = 0;
});
onActivated(async () => {
  if (lesson.list.length > 0) {
    currentCourseSectionId.value = 0;
    transitionTrigger.value = true;
    selectedLesson.value = 0;
  }
});
watch( () => course.active?.id, async () => {
    infiniteList.value.setIndex(0);
    infiniteList.value.resume();
    infiniteList.value.trigger();
  }
);
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
    /*filter: grayscale(1) brightness(0.9);*/
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
  -webkit-animation: 32s linear 0s infinite satelitePlanetRotate;
  animation: 32s linear 0s infinite satelitePlanetRotate;
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
