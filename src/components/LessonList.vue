<template>
    <q-infinite-scroll ref="infiniteList" scroll-taget="scroll-area" @load="onLoad" reverse class="relative-position" style="z-index: 1;padding-top: 50px">
        <template v-slot:loading>
            <div class="row justify-center q-my-md">
            <q-spinner color="primary" name="dots" size="40px" />
            </div>
        </template>

          <div v-for="lesson in lessonList" :key="lesson.id"
              :class="`row q-px-lg ${(lesson.order % 2) ? 'justify-start' : 'justify-end'}`"
              v-intersection="onIntersection"
              :groupBackground="lesson.course_section.background_image"
              :groupGradient="lesson.course_section.background_gradient"
              :lessonId="lesson.id"
              @click="(!lesson.is_blocked) ? openLesson(lesson.id) : false"
          >
                <transition
                  appear
                  enter-active-class="animated fadeInUp"
                  leave-active-class="animated fadeOutDown">
                    <div v-if="transitionTrigger" class="full-width">
                      <q-card v-if="lesson.type == 'group'" class="transparent text-white" flat>
                          <q-card-section>
                              <div class="text-h6"><b>{{ lesson.course_section.title }}</b></div>
                              <div class="text-caption">{{ lesson.course_section.description }}</div>
                          </q-card-section>
                          <q-separator color="white"/>
                      </q-card>
                    </div>
                </transition>
                <div v-if="lesson.type !== 'group'" :class="`col-auto`">
                  <transition
                  appear
                  enter-active-class="animated zoomIn"
                  :leave-active-class="(selectedLesson !== lesson.id) ? 'animated planetBounceInactive' : 'animated planetBounceActive'">
                    <div v-if="transitionTrigger">
                    <q-card class="transparent no-shadow q-ma-sm"
                        :disabled="(lesson.is_blocked === true) ? true : null">
                        <q-btn v-if="lesson.is_blocked === true"
                            color="white"
                            text-color="dark"
                            class="absolute-top"
                            style="top: 10px; left: 10px; z-index: 5; width: 10px;"
                            round
                            icon="lock"
                        ></q-btn>
                        <q-card-section class="transparent no-shadow text-center planet" style="width: 130px; min-height: 130px">
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
                                    :src="satellite.image"
                                    :style="{
                                        width: `${satellite.size}px`,
                                        top: `calc(-${satellite.size}px/2)`,
                                        scale: `calc(-1.${satellite.distance} + 2)`
                                    }"
                                    />
                                </div>
                            </div>
                            <div class="absolute-top flex justify-center items-center full-width full-height">
                                <q-circular-progress v-if="lesson.exercise_id && !lesson.is_blocked"
                                    rounded
                                    show-value
                                    :value="(lesson.exercise?.data.current_page / lesson.exercise?.data.total_pages)*100 || 0"
                                    size="50px"
                                    :thickness="0.18"
                                    color="white"
                                    track-color="white-transparent1"
                                    class="q-ma-none"
                                    style="z-index: 50; left: 0; background: none; text-shadow: 1px 1px 5px black;"
                                >
                                    <b class="text-white ">{{ (lesson.exercise?.data.current_page / lesson.exercise?.data.total_pages)*100 || 0 }}%</b>
                                </q-circular-progress>
                            </div>
                            <q-img
                                :src="lesson.image"
                                loading="lazy"
                                spinner-color="white">
                            </q-img>
                        </q-card-section>
                        <q-card-section class="text-center text-white q-pa-none">
                            <div class="text-bold">{{lesson.title}}</div>
                            <div class="row q-ma-sm">
                                <div class="col text-left"></div>
                                <div class="col  text-right">
                                    <b>{{lesson.exercise?.current_page}}</b>
                                </div>
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
        loading="lazy"
        spinner-color="white"
        />
    </q-page-sticky>
</template>

<script setup>
import { useLesson } from '../composables/useLesson'
import { ref, onActivated, onDeactivated, onMounted, onUnmounted, toRef, watch } from 'vue'
import { useCourse } from '../composables/useCourse'
import { useRouter, onBeforeRouteLeave } from 'vue-router'

const { lesson, getList, getListUpdates } = useLesson()
const { course } = useCourse()
const router = useRouter()

const groupBackground = ref(null)
const groupGradient = ref(null)
const infiniteList = ref(null)
const selectedLesson = ref(0)
const currentCourseSectionId = ref(0)
const transitionTrigger = ref(false)
const inView = ref({})

const props = defineProps({
  disable: Boolean
})
const disable = toRef(props, 'disable')
const lessonList = ref([])

const onLoad = async function (index, done) {
  if (disable.value) return false
  currentCourseSectionId.value = 0
  const isDone = await getList(index)
  if (!isDone) composeList()
  done(isDone)
}
const composeList = () => {
  lessonList.value = []
  for (let i = lesson.list.length - 1; i >= 0; i--) {
    if (checkGroup(lesson.list[i] && lesson.list[i].course_section)) {
      lessonList.value.unshift({ ...{ course_section: lesson.list[i].course_section }, ...{ type: 'group' } })
    }
    lessonList.value.unshift({ ...lesson.list[i], ...{ type: 'lesson' } })
  }
}
const checkGroup = (courseSection) => {
  if (courseSection.id != currentCourseSectionId.value) {
    currentCourseSectionId.value = courseSection.id
    return true
  }
  return false
}
const openLesson = (lessonId) => {
  transitionTrigger.value = false
  selectedLesson.value = lessonId
  setTimeout(() => {
    router.push(`/lesson-startup-${selectedLesson.value}`)
  }, 250)
}
const onIntersection = (entry) => {
  groupBackground.value = entry.target.attributes.groupBackground?.value
  groupGradient.value = entry.target.attributes.groupGradient?.value
  setTimeout(() => {
    inView.value[entry.target.attributes.lessonId?.value] = true
  }, 0)
}
onMounted(() => {
  transitionTrigger.value = true
  selectedLesson.value = 0
})
onActivated(async () => {
  if (lesson.list.length > 0) {
    currentCourseSectionId.value = 0
    await getListUpdates()
    composeList()
    transitionTrigger.value = true
    selectedLesson.value = 0
  }
})
watch(() => course.active?.id, async (newData, oldData) => {
  infiniteList.value.setIndex(0)
  infiniteList.value.resume()
  infiniteList.value.trigger()
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
