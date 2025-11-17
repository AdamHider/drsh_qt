<template>
  <q-page-wrapper>
    <q-app-header class="transparent text-white rounded-b-md q-py-xs" ref="header">
      <q-btn flat icon="arrow_back"  @click="$router.go(-1);" v:slot="back-button" @click.stop="playAudio('click')"/>
      <q-toolbar-title></q-toolbar-title>
      <UserResourceBar v-if="user.active?.data.resources" :resource="user.active?.data.resources.energy" dense no-caption size="24px" push
          @click="() => {if(user.active?.data.resources.energy.quantity == 0) router.push('/market')}"/>
    </q-app-header>
    <q-page :class="`text-center full-width finish-page column`" style="padding-top: 50px; margin-bottom: -1px;">
        <q-card class="transparent text-white no-shadow full-width" style="position: relative; z-index: 1; flex: 1;">
            <q-card-section class="q-pb-none">
                <div class="text-h5"><b>{{ lesson.active.title }}</b></div>
            </q-card-section>
            <q-card-section class="lesson-image q-pt-none relative-position">
                <transition
                  appear
                  enter-active-class="animated fadeIn animation-slow"
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
          <q-card flat class="position-relative text-center text-dark rounded-none q-pt-sm lesson-finish-card" style="z-index: 1; margin-top: -50px; flex: 1;" v-if="transitionTrigger">
            <q-card-section class="q-pb-none q-pt-sm text-positive"  style="margin-top: -100px; z-index: 1">
              <q-img v-if="lesson.active.exercise.data.totals.reward_level == 3 || lesson.active.exercise.data.totals.is_maximum" src="/images/lesson_finish_excellent.png"/>
              <q-img v-else-if="lesson.active.exercise.data.totals.reward_level >= 2" src="/images/lesson_finish_good.png"/>
              <q-img v-else-if="lesson.active.exercise.data.totals.reward_level >= 1" src="/images/lesson_finish_not_bad.png"/>
              <q-img v-else src="/images/lesson_finish_fail.png"/>
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
                <div class="text-subtitle2"><b>Разблокированы планеты:</b></div>
                <q-list>
                    <q-item  v-for="(nextLesson, nextLessonIndex) in lesson.active.next_lessons" :key="`nextLessonIndex-${nextLessonIndex}`"  class="text-left">
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
            <q-card-section class="q-pb-sm q-pt-sm">
                <DailyStreakBlock lite/>
            </q-card-section>
          </q-card>
        </transition>
    </q-page>
    <q-dialog v-model="lowEnergyDialog" position="bottom">
      <div class="full-width column">
        <div class="row">
          <div class="col-6">
            <transition
              appear
              enter-active-class="animated fadeInUp"
              leave-active-class="animated fadeOutDown">
              <img src="/images/characters/codex_full_low_energy.png" style="width: 130%; z-index: -1; margin-bottom: -20px; float: right;"/>
            </transition>
          </div>
        </div>
        <q-card class="bg-white rounded-b-0 full-width" style="overflow: visible;">
          <q-card-section>
              <div class="q-pb-md">
                <div class="text-subtitle1"><b>Внимание, не хватает энергии!</b></div>
                <div class="text-caption">Но она скоро появится! Энергия восстанавливается 1ед./час. Чтобы ускорить этот процесс можно изучить технологии в разделе "Энергетика", либо купить энергию в Космо-маркете</div>
              </div>
          </q-card-section>
          <q-card-actions class="flex justify-stretch items-start">
            <q-btn push class="full-width q-mb-sm"  color="gradient-blue" @click="openSkills()" @click.stop="playAudio('click')">К технологиям <q-icon name="biotech"></q-icon></q-btn>
            <q-btn push class="full-width" color="gradient-green" @click="openMarket()" @click.stop="playAudio('click')">В Космо-маркет <q-icon name="shopping_cart"></q-icon></q-btn>
            <q-btn flat v-close-popup class="full-width q-mt-sm" @click.stop="playAudio('click')"><b>Я подожду</b></q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </q-dialog>

    <q-footer expand position="bottom" class="bg-white">
      <div class="justify-center q-pa-md border-grey border-t-sm flex">
        <q-btn
          push
          label="Заново"
          icon="replay"
          color="gradient-orange"
          class="q-px-md q-mr-sm"
          v-if="lesson.active.type !== 'training'"
          @click="redo()"/>
          <q-btn v-if="nextLesson.exercise?.finished_at || nextLesson.is_blocked || (!lesson.active.parent_id && nextLesson.parent_id !== lesson.active.id)"
            push
            label="Продолжить"
            icon-right="keyboard_double_arrow_right"
            color="gradient-primary"
            class="q-px-md q-mr-sm"
            :loading="buttonLoading"
            @click="next()"/>
          <q-btn v-else-if="nextLesson.exercise?.id"
            push
            label="Продолжить"
            icon-right="play_arrow"
            color="gradient-green"
            class="q-px-md q-mr-sm"
            :loading="buttonLoading"
            @click="open(nextLesson.id)"/>
          <q-spend-button v-else-if="nextLesson.id && !nextLesson.is_blocked"
            push
            color="gradient-primary"
            icon-right="play_arrow"
            class="q-px-md q-mr-sm "
            :resources="nextLesson.cost ?? []"
            :loading="buttonLoading"
            label="Далее"
            @click="start(nextLesson.id)"></q-spend-button>
      </div>
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
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { ref, onMounted } from 'vue'
import UserResourceBar from '../components/UserResourceBar.vue'
import DailyStreakBlock from '../components/DailyStreakBlock.vue'
import { useUserStore } from '../stores/user'
import { playAudio } from 'src/services/audioService';
import { useQuasar } from 'quasar'

const $q = useQuasar()
const { user } = useUserStore()
const route = useRoute()
const router = useRouter()
const { lesson, getItem, setTarget } = useLesson()
const { redoItem, createItem,  } = useExercise()

const lowEnergyDialog = ref(false)

const transitionTrigger = ref(false)

const currentPoints = ref(0)
const previousPoints = ref(0)
const nextLesson = ref({})
const buttonLoading = ref(false)

const load = async () => {
  await getItem(route.params.lesson_id)
  transitionTrigger.value = true
  if(lesson.active.exercise?.data.totals.difference > 0) {
    currentPoints.value = lesson.active.exercise?.data.totals.total;
    previousPoints.value = lesson.active.exercise?.data.totals.total - lesson.active.exercise?.data.totals.difference;
    playAudio('lesson_success')
  }
  if(lesson.active.exercise?.data.totals.difference < 0) {
    currentPoints.value = lesson.active.exercise?.data.totals.total + lesson.active.exercise?.data.totals.difference;
    previousPoints.value = lesson.active.exercise?.data.totals.total;
    playAudio('lesson_fail')
  }
  if(lesson.active.exercise?.data.totals.difference == 0) {
    currentPoints.value = lesson.active.exercise?.data.totals.total
    if(lesson.active.exercise.attempts > 0) previousPoints.value = lesson.active.exercise?.data.totals.total;
    playAudio('lesson_success')
  }
}

const redo = async () => {
  playAudio('click')
  const exerciseRedoCreated = await redoItem(lesson.active.id)
  if (!exerciseRedoCreated.error) router.replace(`/lesson-${lesson.active.id}`)
}
const start = async (lessonId) => {
  buttonLoading.value = true
  playAudio('click')
  const exerciseCreated = await createItem(lessonId)
  buttonLoading.value = false
  if (!exerciseCreated.error) {
    await useUserStore().getItem()
    router.replace(`/lesson-${lessonId}`)
  } else {
    if(exerciseCreated.messages.error == 'not_enough_resources'){
      lowEnergyDialog.value = true
    }
  }
}
const open = async (lessonId) => {
  playAudio('click')
  buttonLoading.value = true
  router.replace(`/lesson-${lessonId}`)
}
const next = async () => {
  playAudio('click')
  if(lesson.active.next_lessons.length > 0){
    if(!lesson.active.parent_id && nextLesson.value.parent_id !== lesson.active.id){
      router.go(-2)
      return
    } else {
      setTarget(nextLesson.value.id)
    }
  } else {
    router.go(-2)
    return
  }
  router.go(-1)
}
const openSkills = () => {
  lowEnergyDialog.value = false
  setTimeout(() => {
    router.push('/skills')
  }, 100)

}
const openMarket = () => {
  lowEnergyDialog.value = false
  setTimeout(() => {
    router.push('/market')
  }, 100)
}

onMounted(async () => {
  await load()
  if(!lesson.active.exercise?.finished_at) router.go(-1)
  if(lesson.active.next_lessons.length > 0){
    nextLesson.value = lesson.active.next_lessons[0]
  }
})
onBeforeRouteLeave((to, from) => {
  if (lowEnergyDialog.value) {
    lowEnergyDialog.value = false
    return false
  }
  return true
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
  animation: rotateRays 25s linear infinite, blinkRays 2s ease infinite alternate;
  opacity: 0.5;
}

@keyframes rotateRays {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes blinkRays {
  0% { opacity: 0.2; }
  50% { opacity: 0.2; }
  100% { opacity: 0.5; }
}

</style>
