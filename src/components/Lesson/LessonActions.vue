<template>
    <q-card v-if="lesson.active.page?.answer?.quantity" flat class="bg-white text-dark ">
        <q-card-section>
            <div class="text-h5">
              <b v-if="answerPercentage == 100">Отлично!</b>
              <b v-else-if="answerPercentage < 80 && answerPercentage >= 40">Хорошо!</b>
              <b v-else-if="answerPercentage < 40">Можно было и лучше!</b>
            </div>
            <div class="text-subtitle1"><b>Ваш результат: </b></div>
            <div class="text-h5">
              <b v-if="answerPercentage == 100" class="text-positive">{{ lesson.active.page?.answer?.points }}</b>
              <b v-else-if="answerPercentage < 80 && answerPercentage >= 40" class="text-warning">{{ lesson.active.page?.answer?.points }}</b>
              <b v-else-if="answerPercentage < 40" class="text-negative">{{ lesson.active.page?.answer?.points }}</b>
            </div>
        </q-card-section>
    </q-card>
    <q-toolbar
        class="q-pa-sm"
        v-if="lesson.active.page && (lesson.active.page?.header?.page_template !== 'chat')">
        <q-btn
            v-if="lesson.active.page?.actions?.main == 'next'"
            push
            style="flex: 2"
            color="positive"
            label="Далее"
            @click="next"
        ></q-btn>
        <q-btn
            v-if="lesson.active.page?.actions?.main == 'confirm'"
            push
            style="flex: 2"
            color="primary"
            label="Ответить"
            @click="confirm"
        ></q-btn>
        <q-btn
            v-if="lesson.active.page?.actions?.main == 'finish'"
            push
            style="flex: 2"
            color="positive"
            icon="done_all"
            label="Завершить"
            @click="finish"
        ></q-btn>
    </q-toolbar>

    <q-dialog v-model="backDialog"  transition-show="scale" transition-hide="scale">
      <q-card class="bg-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">Go back?</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          You are going to the previous page. You realy want to?
        </q-card-section>
        <q-card-actions align="center" class="bg-white text-teal">
          <q-btn push class="col" flat label="Cancel" v-close-popup />
          <q-btn push class="col" color="primary" label="Continue" @click="back" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="confirmDialog"  transition-show="scale" transition-hide="scale">
      <q-card class="bg-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">Confirm the answer?</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          Your answer seems to be incomplete. Please, try at least to complete it randomly=)
        </q-card-section>
        <q-card-actions align="around">
          <q-btn push class="col" flat label="Cancel" v-close-popup />
          <q-btn push class="col" color="primary"  label="Confirm" @click="confirm" v-close-popup />
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

const emits = defineEmits(['onPageChanged', 'onAnswerSaved', 'onDialogOpened'])
const props = defineProps({
  pageAnswers: Object
})

const answerPercentage = computed(() => lesson.active.page?.answer?.correct * 100 / lesson.active.page?.answer?.quantity)

const isEmptyAnswer = computed(() => { for (const i in props.pageAnswers) { if (props.pageAnswers[i].value.text === '') return true } return false })
const { lesson } = useLesson()

const next = async () => {
  emits('onPageChanged', 'next')
  extraActions.value = false
}
const finish = async () => {
  emits('onPageChanged', 'finish')
  extraActions.value = false
}
const confirm = async () => {
  if (!confirmDialog.value && isEmptyAnswer.value) {
    confirmDialog.value = true
    return
  }
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
</script>
