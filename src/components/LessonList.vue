<template>
    <q-infinite-scroll ref="infiniteList" scroll-taget="scroll-area" @load="onLoad" reverse class="relative-position" style="z-index: 1;padding-top: 50px">
        <template v-slot:loading>
            <div class="row justify-center q-my-md">
            <q-spinner color="primary" name="dots" size="40px" />
            </div>
        </template>
        <div v-for="(lesson, index) in lessonList" :key="index"
            :class="`row q-px-lg ${(lesson.order % 2) ? 'justify-start' : 'justify-end'}`"
            v-intersection="onIntersection"
            :groupBackground="lesson.course_section.background_image"
            :groupGradient="lesson.course_section.background_gradient"
        >
            <q-card v-if="lesson.type == 'group'" class="transparent text-white full-width" flat >
                <q-card-section>
                    <div class="text-h6">{{ lesson.course_section.description.title }}</div>
                    <div class="text-caption">{{ lesson.course_section.description.description }}</div>
                </q-card-section>
                <q-separator color="white"/>
            </q-card>
            <div v-else :class="`col-auto`">
                <q-card class="transparent no-shadow q-ma-sm"
                    :disabled="(lesson.is_blocked === true) ? true : null">
                    <q-btn v-if="lesson.is_blocked === true"
                        color="white"
                        text-color="dark"
                        class="absolute-top"
                        style="top: 10px; left: 10px; z-index: 5"
                        round
                        icon="lock"
                    ></q-btn>
                    <router-link v-else
                        :to="`/lesson-startup-${lesson.id}`"
                        class="absolute-top absolute-left full-width full-height"
                        style="z-index: 101"
                    ></router-link>
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
                            <q-circular-progress v-if="!lesson.is_blocked"
                                rounded
                                show-value
                                :value="lesson.exercise?.current_progress || 0"
                                size="50px"
                                :thickness="0.22"
                                color="orange"
                                track-color="white-transparent1"
                                class="q-ma-none"
                                style="z-index: 50; left: 0; background: none;"
                            >
                                <b class="text-white ">{{ lesson.exercise?.current_progress || 0 }}%</b>
                            </q-circular-progress>
                        </div>
                        <q-img
                            :src="lesson.image"
                            loading="lazy"
                            spinner-color="white">
                        </q-img>
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
                </q-card>
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
import { CONFIG } from '../config.js'
import { ref, onActivated, onDeactivated, toRef, watch } from 'vue'
import { useCourse } from '../composables/useCourse'
import { useRouter } from 'vue-router'

const { lesson, getList, clear } = useLesson()
const { course } = useCourse()
const router = useRouter()

const groupBackground = ref(null)
const groupGradient = ref(null)
const infiniteList = ref(null)
const currentParentId = ref(0)

const props = defineProps({
  disable: Boolean
})
const disable = toRef(props, 'disable')
const lessonList = ref([])

const onLoad = async function (index, done) {
  if (disable.value) return false
  const isDone = await getList(index)
  if (!isDone) composeList()
  done(isDone)
}
const composeList = () => {
  const lessons = lesson.list
  lessonList.value = []
  for (let i = lesson.list.length - 1; i >= 0; i--) {
    if (checkGroup(lesson.list[i] && lesson.list[i].course_section)) {
      lessonList.value.unshift({ ...{ course_section: lesson.list[i].course_section }, ...{ type: 'group' } })
    }
    lessonList.value.unshift({ ...lesson.list[i], ...{ type: 'lesson' } })
  }
}
const checkGroup = (lesson) => {
  if (lesson.course_section_id !== currentParentId.value) {
    currentParentId.value = lesson.course_section_id
    return true
  }
  return false
}
const onIntersection = (entry) => {
  groupBackground.value = entry.target.attributes.groupBackground?.value
  groupGradient.value = entry.target.attributes.groupGradient?.value
}
onDeactivated(() => {
})
onActivated(() => {
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
