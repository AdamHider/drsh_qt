<template>
    <q-card v-if="lesson.active.page?.answer?.is_finished" flat class="bg-white text-dark border-t-sm rounded-none" style="border-color: lightgray">
        <q-card-section class="text-center">
            <div class="text-h5 vertical-middle">
              <b v-if="answerPercentage == 100">Отлично!</b>
              <b v-else-if="answerPercentage < 80 && answerPercentage >= 40">Хорошо!</b>
              <b v-else-if="answerPercentage < 40">Можно было и лучше!</b>
            </div>
            <div class="text-subtitle1">
              <b class="vertical-middle">Ваш результат: </b>
              <span class="text-h5 vertical-middle">
                <b v-if="answerPercentage == 100" class="text-positive">{{ lesson.active.page?.answer?.points }}</b>
                <b v-else-if="answerPercentage < 80 && answerPercentage >= 40" class="text-warning">{{ lesson.active.page?.answer?.points }}</b>
                <b v-else-if="answerPercentage < 40" class="text-negative">{{ lesson.active.page?.answer?.points }}</b>
              </span>
            </div>
        </q-card-section>
    </q-card>
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
            v-if="lesson.active.page?.actions?.main == 'confirm' "
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

    <q-dialog v-model="confirmDialog"  transition-show="scale" transition-hide="scale">
      <q-card class="bg-white text-center" style="width: 300px">
        <q-card-section>
          <div class="text-h6"><b>Подтвердить ответ?</b></div>
          <div>Некоторые поля остались незаполненными. Советуем заполнить их хотя-бы случайными ответами.</div>
        </q-card-section>
        <q-card-actions align="around">
          <q-btn flat class="col" color="grey" v-close-popup><b>Отмена</b></q-btn>
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
    return
  }

  isLoading.value = true
  emits('onAnswerSaved')
  extraActions.value = false
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
})
</script>
