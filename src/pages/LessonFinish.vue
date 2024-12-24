<template>
  <q-page-wrapper>
    <q-page class="text-center full-width finish-page" style="padding-top: 50px;">
        <transition
            appear
            enter-active-class="animated fadeInUp animation-slow"
            leave-active-class="animated rubberBand  animation-delay-1">
          <q-card v-if="transitionTrigger" flat class="relative text-white text-center transparent full-width " style="z-index: 1;">
              <q-card-section class="q-pb-sm">
                  <div class="text-h5"><b>Congratulations!</b></div>
                  <div class="text-h6">You have completed the lesson!</div>
              </q-card-section>
          </q-card>
        </transition>
        <q-card class="transparent no-shadow full-width" style="position: relative; z-index: 1;">
            <q-card-section class="lesson-image">
                <transition
                    appear
                    enter-active-class="animated fadeInUp animation-slow"
                    leave-active-class="animated rubberBand  animation-delay-1" >
                  <q-img
                    width="300px"
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
          <q-card flat class="relative text-white transparent full-width " style="z-index: 1;"
            v-if="transitionTrigger">
              <q-card-section class="q-pb-sm text-center">
                  <div class="text-h5"><b>{{lesson.active.title}}</b></div>
              </q-card-section>
              <q-card-section class="q-pb-sm text-left">
                <q-list bordered dark class="bg-dark-transparent rounded-sm">
                  <q-item>
                    <q-item-section>
                      <q-item-label>Exercises</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                       <q-item-label class="text-orange"><b>{{ lesson.active.exercise.data.totals.exercises }}</b> <q-icon name="star"></q-icon></q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>Time bonus</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                       <q-item-label class="text-orange"><b>{{ lesson.active.exercise.data.totals.time }}</b> <q-icon name="star"></q-icon></q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-separator dark/>
                  <q-item>
                    <q-item-section>
                      <q-item-label><b>Total</b></q-item-label>
                    </q-item-section>
                    <q-item-section side>
                       <q-item-label class="text-orange text-h6"><b>{{ lesson.active.exercise.data.totals.total }}</b> <q-icon name="star"></q-icon></q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
        </transition>
    </q-page>
    <q-footer expand position="bottom" class="bg-transparent">
      <q-toolbar class="q-pa-sm justify-center">
        <q-btn
          push
          label="Redo"
          icon="replay"
          color="gradient-orange"
          class="q-px-md q-mr-sm"
          @click="redo(lesson.active.id)"/>
        <q-btn
          push
          label="Great!"
          icon="check"
          color="gradient-green"
          class="q-px-md q-mr-sm"
          @click="$router.go(-1)"/>
        </q-toolbar>
    </q-footer>
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

const load = async () => {
  await getItem(route.params.lesson_id)
  transitionTrigger.value = true
}
const redo = async (lessonId) => {
  const exerciseRedoCreated = await redoItem(lessonId)
  if (!exerciseRedoCreated.error) router.push(`/lesson-${lessonId}`)
}
onMounted(() => {
  load()
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
