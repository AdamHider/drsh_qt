<template>
  <q-page-wrapper>
    <q-page :class="`text-center full-width finish-page `" style="padding-top: 50px;">
        <q-card class="transparent text-white no-shadow full-width" style="position: relative; z-index: 1;">
            <q-card-section class="q-pb-none">
                <div class="text-h5"><b>{{ lesson.active.title }}</b></div>
            </q-card-section>
            <q-card-section class="lesson-image q-pt-none relative-position">
                <transition
                  appear
                  enter-active-class="animated fadeIn animation-slow animation-delay-2"
                  leave-active-class="animated fadeOut  animation-delay-1">
                  <q-img v-if="transitionTrigger" class="bg-rays" src="/images/rays.png"/>
                </transition>
                <transition
                  appear
                  enter-active-class="animated fadeInUp animation-slow"
                  leave-active-class="animated rubberBand  animation-delay-1">
                  <q-img
                    v-if="transitionTrigger"
                    :src="lesson.active.image"
                    no-spinner
                  />
                </transition>
            </q-card-section>
        </q-card>
        <transition
          appear
          enter-active-class="animated fadeInUp animation-delay-2"
          leave-active-class="animated zoomOut">
          <q-card flat class="position-relative text-center text-dark rounded-none q-pt-sm lesson-finish-card" style="z-index: 1; margin-top: -50px;" v-if="transitionTrigger">
            <q-card-section class="q-pb-none q-pt-sm text-positive"  style="margin-top: -100px; z-index: 1">
              <q-img v-if="lesson.active.exercise.data.totals.reward_level == 3" src="/images/lesson_finish_excellent.png"/>
              <q-img v-else-if="lesson.active.exercise.data.totals.reward_level >= 2" src="/images/lesson_finish_good.png"/>
              <q-img v-else-if="lesson.active.exercise.data.totals.reward_level >= 1" src="/images/lesson_finish_not_bad.png"/>
              <q-img v-else src="/images/lesson_finish_fail.png"/>
            </q-card-section>
            <q-card-section class="q-pb-sm q-pt-sm">
              <q-list  separator class="q-pa-xs text-left bg-grey-3 rounded-sm">
                <q-item  v-if="lesson.active.exercise.data.totals.difference !== 0">
                  <q-item-section>
                    <b>Предыдущий результат: </b>
                  </q-item-section>
                  <q-item-section side>
                    <b>{{ previousPoints }}</b>
                  </q-item-section>
                </q-item>
                <q-item >
                  <q-item-section>
                    <b>Твой результат: </b>
                  </q-item-section>
                  <q-item-section side>
                    <div v-if="lesson.active.exercise.data.totals.difference > 0 || lesson.active.exercise.data.totals.is_maximum">
                      <q-avatar class="q-mr-xs" size="sm" color="green-2"><q-icon size="xs" color="positive" name="keyboard_double_arrow_up"></q-icon></q-avatar>
                      <b class="text-positive" style="vertical-align: middle">{{ currentPoints }}</b>
                    </div>
                    <div v-else>

                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
            <q-card-section v-if="lesson.active.exercise.data.totals.reward" class="q-pb-sm q-pt-sm">
              <div class="q-pa-sm q-pb-md bg-grey-3 rounded-sm">
                <div class="text-center text-subtitle2 q-pt-none q-pb-sm"><b>Награда: </b></div>
                <div class="row q-gutter-sm items-center justify-center">
                  <div v-for="(resource, resourceIndex) in lesson.active.exercise.data.totals.reward" :key="`resource-${resourceIndex}`" >
                      <UserResourceBar :resource="resource" dense no-caption size="26px" push/>
                  </div>
                </div>
              </div>
            </q-card-section>
            <q-card-section class="q-pb-sm q-pt-sm"  v-if="lesson.active.next_lessons.length > 0">
              <div class="q-pa-sm bg-grey-3 rounded-sm">
                <div class="text-subtitle2"><b>Разблокировано:</b></div>
                <q-list>
                  <q-item class="text-left"  v-for="(nextLesson, nextLessonIndex) in lesson.active.next_lessons" :key="`nextLessonIndex-${nextLessonIndex}`">
                    <q-item-section avatar>
                        <q-img :src="nextLesson.image"/>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label><b>{{ nextLesson.title }}</b></q-item-label>
                      <q-item-label caption lines="2">{{ nextLesson.description }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </q-card-section>
            <q-card-actions class="justify-center q-pa-md">
              <q-btn
                push
                label="Заново"
                icon="replay"
                color="gradient-orange"
                class="q-px-md q-mr-sm"
                @click="redo(lesson.active.id)"/>
              <q-btn
                push
                label="Далее"
                icon-right="chevron_right"
                color="gradient-green"
                class="q-px-md q-mr-sm"
                @click="$router.go(-1)"/>
            </q-card-actions>
          </q-card>
        </transition>
    </q-page>

    <q-page-sticky
        class="fixed full-width full-height"
        :style="`background: ${lesson.active.course_section?.background_gradient}; transform: none`"
        >
        <q-img
        :src="lesson.active.course_section?.background_image"
        class="absolute-top absolute-left full-width full-height"
        loading="lazy"
        spinner-color="white"
        />
    </q-page-sticky>
  </q-page-wrapper>
</template>

<script setup>
import { useLesson } from '../composables/useLesson'
import { useExercise } from '../composables/useExercise'
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import UserResourceBar from '../components/UserResourceBar.vue'

const route = useRoute()
const router = useRouter()
const { lesson, getItem } = useLesson()
const { redoItem } = useExercise()

const transitionTrigger = ref(false)

const currentPoints = ref(0)
const previousPoints = ref(0)

const load = async () => {
  await getItem(route.params.lesson_id)
  transitionTrigger.value = true
  if(lesson.active.exercise?.data.totals.difference > 0) {
    currentPoints.value = lesson.active.exercise?.data.totals.points;
    previousPoints.value = lesson.active.exercise?.data.totals.points - lesson.active.exercise?.data.totals.difference;
  }
  if(lesson.active.exercise?.data.totals.difference < 0) {
    currentPoints.value = lesson.active.exercise?.data.totals.points + lesson.active.exercise?.data.totals.difference;
    previousPoints.value = lesson.active.exercise?.data.totals.points;
  }
  if(lesson.active.exercise?.data.totals.difference == 0) {
    currentPoints.value = lesson.active.exercise?.data.totals.points
  }
}

const redo = async (lessonId) => {
  const exerciseRedoCreated = await redoItem(lessonId)
  if (!exerciseRedoCreated.error) router.replace(`/lesson-${lessonId}`)
}
onMounted(async () => {
  await load()
  if(!lesson.active.exercise?.finished_at) router.go(-1)
})
</script>
<style lang="scss">

.lesson-finish-card::before{
    content: "";
    position: absolute;
    background-image: url("/images/clouds.png");
    width: 100%;
    height: 100%;
    background-size: 150%;
    background-position: center bottom;
    background-repeat: no-repeat;
    bottom: 100%;
    left: 0;
}
.bg-rays{
  position: absolute;
  width: 150%;
  height: 150%;
  left: -25%;
  top: -25%;
  opacity: 0.7;
  animation: rotateRays 25s linear infinite, blinkRays 4s ease;
}

@keyframes rotateRays {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes blinkRays {
  0% { opacity: 0; }
  50% { opacity: 0; }
  100% { opacity: 0.7; }
}

</style>
