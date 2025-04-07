<template>
  <q-page-wrapper>
    <q-page class="text-center full-width finish-page" style="padding-top: 50px;">
        <q-card class="transparent text-white no-shadow full-width" style="position: relative; z-index: 1;">
            <q-card-section class="q-pb-none">
                <div class="text-h5"><b>{{ lesson.active.title }}</b></div>
            </q-card-section>
            <q-card-section class="lesson-image q-pt-none">
                <transition
                    appear
                    enter-active-class="animated fadeInUp animation-slow"
                    leave-active-class="animated rubberBand  animation-delay-1" >
                  <q-img
                    v-if="transitionTrigger"
                    :src="lesson.active.image"
                    no-spinner
                  />
                </transition>
            </q-card-section>
        </q-card>

    </q-page>
    <q-footer expand position="bottom" class="bg-transparent">
      <transition
          appear
          enter-active-class="animated fadeInUp animation-delay-2"
          leave-active-class="animated zoomOut">
          <q-card flat class="relative text-center text-dark rounded-b-0 q-pt-sm" style="z-index: 1;" v-if="transitionTrigger">
            <q-card-section class="flex justify-center items-end q-pb-none absolute full-width" v-if="lesson.active.exercise.data.totals.difference > 0 && false" style="top: -100px; z-index: 1">
                <q-avatar size="90px" :class="`star-item`"><img :src="(lesson.active.exercise.data.totals.reward_level >= 1) ? '/images/star_21.png' : '/images/star_21_inactive.png'"></q-avatar>
                <q-avatar size="90px" :class="`star-item q-mb-md`"><img :src="(lesson.active.exercise.data.totals.reward_level == 3) ? '/images/star_23.png' : '/images/star_23_inactive.png'"></q-avatar>
                <q-avatar size="90px" :class="`star-item`"><img :src="(lesson.active.exercise.data.totals.reward_level >= 2) ? '/images/star_22.png' : '/images/star_22_inactive.png'"></q-avatar>
            </q-card-section>
            <q-card-section v-if="lesson.active.exercise.data.totals.difference == 0" class="q-pb-sm q-pt-sm text-orange">
                <div class="text-h5"><b>Ничья!</b></div>
                <div class="text-h6"><b>Ни лучше, ни хуже</b></div>
            </q-card-section>
            <q-card-section v-else-if="lesson.active.exercise.data.totals.reward_level > 0 || lesson.active.exercise.data.totals.is_maximum" class="q-pb-sm q-pt-sm text-positive">
                <div v-if="lesson.active.exercise.data.totals.is_maximum" class="text-h5"><b>Лучше некуда!</b></div>
                <div v-else class="text-h5"><b>Победа!</b></div>
                <div class="text-h6">
                  <b v-if="lesson.active.exercise.data.totals.reward_level >= 1">Неплохой результат</b>
                  <b v-else-if="lesson.active.exercise.data.totals.reward_level >= 2">Хороший результат</b>
                  <b v-else-if="lesson.active.exercise.data.totals.reward_level == 3">Отличный результат</b>
                </div>
            </q-card-section>
            <q-card-section v-else class="q-pb-sm q-pt-sm text-negative">
                <div class="text-h5"><b>Поражение!</b></div>
                <div class="text-h6"><b>Ты можешь лучше</b></div>
            </q-card-section>
            <q-card-section class="q-pb-sm q-pt-sm">
                <div class="text-subtitle2" v-if="lesson.active.exercise.data.totals.difference !== 0">
                  <b>Предыдущий результат: </b>
                  <b>{{ previousPoints }}</b>
                </div>
                <div class="text-subtitle1">
                  <b>Ваш результат: </b>
                  <b :class="(lesson.active.exercise.data.totals.difference > 0 || lesson.active.exercise.data.totals.is_maximum) ? 'text-positive' : 'text-negative'">{{ currentPoints }}</b>
                </div>
            </q-card-section>
            <q-card-section class="q-pb-sm q-pt-sm">
              <div class="q-pa-sm bg-grey-3 rounded-sm">
                <div class="text-center text-subtitle2"><b>Награда: </b></div>
                <div class="row justify-center q-gutter-sm q-py-sm">
                  <div v-for="(resource, resourceIndex) in lesson.active.exercise.data.totals.reward" :key="resourceIndex" >
                    <q-item :class="`text-left rounded-borders bg-light-gradient-${resource?.color} text-white`" >
                          <q-item-section avatar style="min-width: unset;">
                              <q-img width="25px" :src="resource.image" style="filter: drop-shadow(1px 3px 3px #00000075)"/>
                          </q-item-section>
                          <q-item-section>
                              <q-item-label><b>{{resource.quantity}}</b></q-item-label>
                          </q-item-section>
                      </q-item>
                  </div>
                </div>
              </div>
            </q-card-section>
            <q-card-section class="q-pb-sm q-pt-sm" v-if="lesson.active.next_lessons.length > 0">
              <div class="q-pa-sm bg-grey-3 rounded-sm">
                <div class="text-subtitle2"><b>Вы разблокировали:</b></div>
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
    </q-footer>
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

$particles: 50;
$width: 300;
$height: 300;

$box-shadow: ();
$box-shadow2: ();
@for $i from 0 through $particles {
  $box-shadow: $box-shadow,
               random($width)-$width / 2 + px
               random($height)-$height / 1.2 + px
               $warning;
  $box-shadow2: $box-shadow2, 0 0 #fff
}
@mixin keyframes ($animationName) {
    @-webkit-keyframes #{$animationName} {
        @content;
    }

    @-moz-keyframes #{$animationName} {
        @content;
    }

    @-o-keyframes #{$animationName} {
        @content;
    }

    @-ms-keyframes #{$animationName} {
        @content;
    }

    @keyframes #{$animationName} {
        @content;
    }
}

@mixin animation-delay ($settings) {
    -moz-animation-delay: $settings;
    -webkit-animation-delay: $settings;
    -o-animation-delay: $settings;
    -ms-animation-delay: $settings;
    animation-delay: $settings;
}

@mixin animation-duration ($settings) {
    -moz-animation-duration: $settings;
    -webkit-animation-duration: $settings;
    -o-animation-duration: $settings;
    -ms-animation-duration: $settings;
    animation-duration: $settings;
}

@mixin animation ($settings) {
    -moz-animation: $settings;
    -webkit-animation: $settings;
    -o-animation: $settings;
    -ms-animation: $settings;
    animation: $settings;
}

@mixin transform ($settings) {
    transform: $settings;
    -moz-transform: $settings;
    -webkit-transform: $settings;
    -o-transform: $settings;
    -ms-transform: $settings;
}

.finish-page:after {
  content: "";
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  box-shadow: $box-shadow2;
  @include animation((1s bang ease-out infinite backwards, 1s gravity ease-in infinite backwards, 5s position linear infinite backwards));
  @include animation-delay((1.25s, 1.25s, 1.25s));
  @include animation-duration((1.25s, 1.25s, 6.25s));
}
@include keyframes(bang) {
  to {
    box-shadow:$box-shadow;
  }
}
@include keyframes(gravity)  {
  to {
    @include transform(translateY(200px));
    opacity: 0;
  }
}
@include keyframes(position) {
  0%, 19.9% {
    margin-top: 10vh;
    margin-left: 40vw;
  }
  20%, 39.9% {
    margin-top: 50vh;
    margin-left: 30vw;
  }
  40%, 59.9% {
    margin-top: 20vh;
    margin-left: 70vw
  }
  60%, 79.9% {
    margin-top: 30vh;
    margin-left: 20vw;
  }
  80%, 99.9% {
    margin-top: 30vh;
    margin-left: 80vw;
  }
}
</style>
