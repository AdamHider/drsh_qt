<template>
  <q-page-wrapper>
    <q-page class="text-center full-width" style="padding-top: 50px;">
        <transition
            appear
            enter-active-class="animated fadeInUp animation-slow"
            leave-active-class="animated rubberBand  animation-delay-1" >

          <q-card flat class="relative text-white text-center transparent full-width " style="z-index: 1;"
            v-if="transitionTrigger">
              <q-card-section class="q-pb-sm">
                  <div class="text-h5"><b>Congratulations!</b></div>
                  <div class="text-h6">You have completed the lesson!</div>
              </q-card-section>
          </q-card>
        </transition>
        <q-card class="transparent no-shadow full-width" style="position: relative; z-index: 1;">
            <q-card-section>
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
        <transition
          appear
          enter-active-class="animated fadeInUp animation-delay-2"
          leave-active-class="animated zoomOut">
          <q-card flat class="relative text-white transparent full-width " style="z-index: 1;"
            v-if="transitionTrigger">
              <q-card-section class="q-pb-sm text-center">
                  <div class="text-h5"><b>{{lesson.active.title}}</b></div>
              </q-card-section>
              <q-card-section v-if="lesson.active.parent_id" class="q-pb-sm">
                  <div class="text-caption">
                    This lesson is sattelite of
                    <router-link :to="`/lesson-startup-${lesson.active.parent_id}`">
                      {{ lesson.active.master_lesson.title }}
                    </router-link>
                  </div>
              </q-card-section>
            </q-card>
        </transition>
    </q-page>
    <q-footer expand position="bottom" class="bg-white lesson-bottombar ">
      <q-toolbar>
        <q-btn v-if="lesson.active.exercise?.finished_at"
          push
          label="Redo"
          icon="replay"
          color="gradient-orange"
          @click="redo(lesson.active.id)"/>
        <q-btn v-else-if="lesson.active.exercise?.id"
          push
          label="Continue"
          icon-right="play_arrow"
          color="gradient-green"
          class="q-px-md"
          @click="open(lesson.active.id)"/>
        </q-toolbar>
    </q-footer>
  </q-page-wrapper>
</template>

<script setup>
import { useLesson } from '../composables/useLesson'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { ref, computed, onMounted, defineAsyncComponent } from 'vue'
import { useUserStore } from '../stores/user'

const route = useRoute()
const { lesson, getItem } = useLesson()
const { user } = useUserStore()

const dialogOpened = ref(false)

const transitionTrigger = ref(false)
const closeDialog = ref(false)
const closeConfirmed = ref(false)

const load = async () => {
  await getItem(route.params.lesson_id)
  transitionTrigger.value = true
}
onMounted(() => {
  closeConfirmed.value = false
  load()
})
</script>
<style lang="scss">

.q-select.q-select-inline .q-field__control,
.q-select.q-select-inline .q-field__native {
  min-height: 18px;
  padding: 0;
}

.green-word{
  color: $positive
}
.orange-word{
  color: $accent
}

.q-select.correct-answer.q-field--standard .q-field__control::before{
    border-color: $positive;
}
.q-select.wrong-answer.q-field--standard .q-field__control::before{
    border-color: $negative;
}

.lesson-bottombar{
  box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.12);
}

</style>
