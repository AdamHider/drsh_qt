<template>
    <q-card v-if="lesson.active.page?.answer?.is_finished" flat class="bg-white text-dark border-t-sm rounded-none" style="border-color: lightgray">
        <q-card-section class="text-center">
          <transition
          appear
          enter-active-class="animated fadeInUp"
          leave-active-class="animated fadeOutDown">
            <div>
              <div class="text-h6 " v-if="lesson.active.page?.answer?.is_finished">
                <b v-if="answerPercentage == 100">Превосходно!</b>
                <b v-else-if="answerPercentage < 80 && answerPercentage >= 40">Хороший результат!</b>
                <b v-else-if="answerPercentage < 40">Можно было и лучше!</b>
              </div>
              <div class="text-subtitle2 " v-if="lesson.active.page?.answer?.is_finished">
                <span v-if="answerPercentage == 100">Всё выполнено по высшему разряду</span>
                <span v-else-if="answerPercentage < 80 && answerPercentage >= 40">Но ещё есть куда расти</span>
                <span v-else-if="answerPercentage < 40">Будь внимательнее и всё получится!</span>
              </div>
              <div v-if="lesson.active.page?.answer?.is_finished" class="flex justify-center q-mt-sm">
                <q-chip v-if="lesson.active.page?.timer" color="gradient-blue" text-color="white" class="q-push rounded-sm" size="16px" icon="timer"><b>+{{ lesson.active.page?.answer?.time_bonus }}</b></q-chip>
                <q-chip class=" q-push rounded-sm" color="gradient-primary" text-color="white" size="16px" icon="star"><b>+{{ lesson.active.page?.answer?.total }}</b></q-chip>
              </div>
            </div>
          </transition>
        </q-card-section>
    </q-card>
    <div v-if="lesson.active.page?.actions?.main == 'confirm' && lesson.active.page?.timer" class="text-dark q-pa-sm">
      <transition appear enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown">
        <div v-if="pageTimerTimeLeft > 0">
          <div class="flex justify-between">
            <div class="text-subtitle1"><b>Бонус за время:</b></div>
            <div :class="`text-subtitle1 text-primary ${(pageTimerSeconds <= 2) ? (pageTimerTimeLeft == 0) ? 'text-grey-7' : 'text-negative' : ''}`">
              <span class="text-h5" :style="`transition: 0.1s all ease; transform-origin: right; scale: 1.${pageTimerMiliseconds}; display: inline-block;`"><b>{{ pageTimerSeconds }}</b></span>
              <b>.{{pageTimerMiliseconds}}</b>
            </div>
          </div>
          <q-linear-progress :value="pageTimerProgress" size="12px"  animation-speed="100" rounded/>
        </div>
      </transition>
    </div>
    <q-toolbar class="q-pa-sm" v-if="mainAction">
      <q-btn
        push
        style="flex: 2"
        :loading="isLoading"
        :color="mainAction.color"
        :label="mainAction.label"
        :icon="mainAction.icon || undefined"
        @click="mainAction.handler"
      />
    </q-toolbar>

    <q-dialog v-model="confirmDialog"  transition-show="scale" transition-hide="scale" @hide="closeConfirmDialog">
      <q-card class="bg-white text-center" style="width: 300px">
        <q-card-section>
          <div class="text-h6"><b>Подтвердить ответ?</b></div>
          <div>Некоторые поля остались незаполненными. Советуем заполнить их хотя-бы случайными ответами.</div>
        </q-card-section>
        <q-card-actions align="around">
          <q-btn flat class="col" color="grey" @click="closeConfirmDialog()" @click.stop="playAudio('click')"><b>Отмена</b></q-btn>
          <q-btn push class="col" color="primary" @click="confirm" v-close-popup @click.stop="playAudio('click')"><b>Продолжить</b></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

</template>

<script setup>
import { useLesson } from '../../composables/useLesson'
import { computed, ref, watch } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { playAudio } from '../../services/audioService';



const backDialog = ref(false)
const confirmDialog = ref(false)

const pageTimer = ref(0)
const pageTimerTimeLeft = ref(0)
const pageTimerSeconds = ref(0)
const pageTimerMiliseconds = ref(0)
const pageTimerProgress = ref(1)
const pageTimerStarted = ref(false)

const extraActions = ref(false)
const isLoading = ref(false)

const emits = defineEmits(['onPageChanged', 'onAnswerSaved', 'onDialogOpened'])
const props = defineProps({
  pageAnswers: Object,
  rendered: Boolean
})
const mainAction = computed(() => {
  const page = lesson.active.page;
  if (!page) return null;

  const action = page.actions?.main;
  const template = page.header?.page_template;
  const formTemplate = page.header?.form_template;

  const isExcludedTemplate = 
    ['chat', 'syllables'].includes(template) || 
    (formTemplate === 'image' && action === 'confirm');
  const isFinishAction = action === 'finish';
  
  const shouldShowToolbar = !isExcludedTemplate || isFinishAction;
  if (!shouldShowToolbar) return null;

  if (action === 'next') {
    return { label: 'Далее', color: 'positive', icon: null, handler: next };
  }
  
  if (action === 'confirm') {
    return { label: 'Ответить', color: 'primary', icon: null, handler: confirm };
  }
  
  if (action === 'finish') {
    return { label: 'Завершить', color: 'positive', icon: 'done_all', handler: finish };
  }

  return null;
});
const answerPercentage = computed(() => lesson.active.page?.answer?.correct * 100 / lesson.active.page?.answer?.quantity)

const isEmptyAnswer = computed(() => { for (const i in props.pageAnswers) { if (props.pageAnswers[i].value.text === '' || props.pageAnswers[i].value.text === false ) return true } return false })
const { lesson, unlinkTrainingItem } = useLesson()

const next = async () => {
  playAudio('click')
  isLoading.value = true
  if(lesson.active.page?.header?.is_training && answerPercentage.value >= 100){
    await unlinkTrainingItem()
  }
  emits('onPageChanged', 'next')
  extraActions.value = false
}
const finish = async () => {
  playAudio('click')
  isLoading.value = true
  if(lesson.active.page?.header?.is_training && answerPercentage.value >= 100){
    await unlinkTrainingItem()
  }
  emits('onPageChanged', 'finish')
  extraActions.value = false
}
const confirm = async () => {
  playAudio('click')
  if (!confirmDialog.value && isEmptyAnswer.value) {
    confirmDialog.value = true
    pageTimerStarted.value = false
    return
  }
  isLoading.value = true
  emits('onAnswerSaved', pageTimerProgress.value*100, () => {
    if((lesson.active.page?.answer?.correct * 100 / lesson.active.page?.answer?.quantity) > 40){
      playAudio('page_success')
    } else {
      playAudio('page_fail')
    }
  })
  pageTimerStarted.value = false
  extraActions.value = false
}
const closeConfirmDialog = () => {
  confirmDialog.value = false
  pageTimerStarted.value = true
  startTimer()
}

const startTimer = () => {
  setTimeout(() => {
    if(!pageTimerStarted.value || !lesson.active.page?.timer) return
    pageTimerTimeLeft.value = Math.round(pageTimer.value * 100) / 100;
    pageTimer.value -= 0.05
    pageTimerSeconds.value = Math.floor(pageTimerTimeLeft.value)
    pageTimerMiliseconds.value = Math.round((pageTimerTimeLeft.value - pageTimerSeconds.value) * 100)
    if(pageTimerMiliseconds.value < 10) pageTimerMiliseconds.value = '0'+pageTimerMiliseconds.value

    if(pageTimer.value < 0) pageTimer.value = 0
    pageTimerProgress.value -= 0.05/lesson.active.page.timer.time*1
    if(pageTimer.value > 0) startTimer()
  }, 50)
}

onBeforeRouteLeave((to, from) => {
  if (backDialog.value) {
    backDialog.value = false
    return false
  }
  if (confirmDialog.value) {
    confirmDialog.value = false
    return false
  }
  return true
})

watch(() => backDialog.value, (newValue, oldValue) => {
  emits('onDialogOpened', newValue)
})
watch(() => confirmDialog.value, (newValue, oldValue) => {
  emits('onDialogOpened', newValue)
})
watch(() => props.rendered, (newValue, oldValue) => {
  if(newValue){
    isLoading.value = false
  } else {
    isLoading.value = true
  }
  pageTimer.value = 0
  pageTimerProgress.value = 1
  if(lesson.active.page.timer && !lesson.active.page?.answer?.is_finished) {
    pageTimerStarted.value = true
    pageTimer.value = lesson.active.page.timer.time*1
    pageTimerTimeLeft.value = Math.round(pageTimer.value * 100) / 100;
    onImagesRendered(() => {
      startTimer()
      isLoading.value = false
    })
  } 
})

const onImagesRendered = (callback) => {
  const images = [...document.querySelectorAll(".q-page img")];
  if(images.length == 0){
    callback()
  }
  images.map(im=>new Promise(res=>
    im.onload = callback
  ))
}
</script>
