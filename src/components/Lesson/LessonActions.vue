<template>
    <q-card v-if="lesson.active.page?.answer?.is_finished" flat class="bg-white text-dark border-t-sm rounded-none" style="border-color: lightgray">
        <q-card-section class="text-center">
          <transition
          appear
          enter-active-class="animated fadeInUp"
          leave-active-class="animated fadeOutDown">
            <div class="text-h5 vertical-middle" v-if="lesson.active.page?.answer?.is_finished">
              <b v-if="answerPercentage == 100">Отличный результат!</b>
              <b v-else-if="answerPercentage < 80 && answerPercentage >= 40">Хороший результат!</b>
              <b v-else-if="answerPercentage < 40">Можно было и лучше!</b>
            </div>
          </transition>
          <transition
          appear
          enter-active-class="animated fadeInUp animation-delay-1"
          leave-active-class="animated fadeOutDown">
            <div v-if="lesson.active.page?.answer?.is_finished">
              <q-list class="text-left q-mt-sm " dense v-if="lesson.active.page?.timer">
                <q-item>
                  <q-item-section>Баллы:</q-item-section>
                  <q-item-section class="text-right"><b>+{{ lesson.active.page?.answer?.points }}</b></q-item-section>
                </q-item>
                <q-separator inset />
                <q-item>
                  <q-item-section>Бонус за время:</q-item-section>
                  <q-item-section class="text-right"><b>+{{ lesson.active.page?.answer?.time_bonus }}</b></q-item-section>
                </q-item >
                <q-separator inset />
                <q-item>
                  <q-item-section><b>Всего:</b></q-item-section>
                  <q-item-section class="text-right text-primary text-bold text-h6"><b>{{ lesson.active.page?.answer?.total }}</b></q-item-section>
                </q-item>
              </q-list>
              <q-list class="text-left q-mt-sm " dense v-else>
                <q-item>
                  <q-item-section><b>Всего баллов:</b></q-item-section>
                  <q-item-section class="text-right text-primary text-bold text-h6"><b>{{ lesson.active.page?.answer?.total }}</b></q-item-section>
                </q-item>
              </q-list>
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
    <q-toolbar
        class="q-pa-sm"
        v-if="lesson.active.page && (lesson.active.page?.header?.page_template !== 'chat' || lesson.active.page?.actions?.main == 'finish')">
        <q-btn
            v-if="lesson.active.page?.actions?.main == 'next'"
            push
            :loading="isLoading"
            style="flex: 2"
            color="positive"
            label="Далее"
            @click="next"
        ></q-btn>
        <q-btn
            v-if="lesson.active.page?.actions?.main == 'confirm'"
            push
            :loading="isLoading"
            style="flex: 2"
            color="primary"
            label="Ответить"
            @click="confirm"
        ></q-btn>
        <q-btn
            v-if="lesson.active.page?.actions?.main == 'finish'"
            push
            :loading="isLoading"
            style="flex: 2"
            color="positive"
            icon="done_all"
            label="Завершить"
            @click="finish"
        ></q-btn>
    </q-toolbar>

    <q-dialog v-model="confirmDialog"  transition-show="scale" transition-hide="scale" @hide="closeConfirmDialog">
      <q-card class="bg-white text-center" style="width: 300px">
        <q-card-section>
          <div class="text-h6"><b>Подтвердить ответ?</b></div>
          <div>Некоторые поля остались незаполненными. Советуем заполнить их хотя-бы случайными ответами.</div>
        </q-card-section>
        <q-card-actions align="around">
          <q-btn flat class="col" color="grey" @click="closeConfirmDialog()"><b>Отмена</b></q-btn>
          <q-btn push class="col" color="primary" @click="confirm" v-close-popup><b>Продолжить</b></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

</template>

<script setup>
import { useLesson } from '../../composables/useLesson'
import { computed, ref, watch } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

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
  pageAnswers: Object
})

const answerPercentage = computed(() => lesson.active.page?.answer?.correct * 100 / lesson.active.page?.answer?.quantity)

const isEmptyAnswer = computed(() => { for (const i in props.pageAnswers) { if (props.pageAnswers[i].value.text === '' || props.pageAnswers[i].value.text === false ) return true } return false })
const { lesson } = useLesson()

const next = async () => {
  isLoading.value = true
  emits('onPageChanged', 'next')
  extraActions.value = false
}
const finish = async () => {
  isLoading.value = true
  emits('onPageChanged', 'finish')
  extraActions.value = false
}
const confirm = async () => {
  if (!confirmDialog.value && isEmptyAnswer.value) {
    confirmDialog.value = true
    pageTimerStarted.value = false
    return
  }
  isLoading.value = true
  emits('onAnswerSaved', pageTimerProgress.value*100)
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
watch(() => lesson.active.page, (newValue, oldValue) => {
  isLoading.value = false
  pageTimer.value = 0
  pageTimerProgress.value = 1
  if(lesson.active.page.timer && !lesson.active.page?.answer?.is_finished) {
    pageTimerStarted.value = true
    pageTimer.value = lesson.active.page.timer.time*1
    pageTimerTimeLeft.value = Math.round(pageTimer.value * 100) / 100;
    startTimer()
  }
})
</script>
