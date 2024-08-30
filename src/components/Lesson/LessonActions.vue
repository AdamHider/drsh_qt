<template>
    <q-card v-if="lesson.active.page?.answers?.is_finished" flat class="bg-white text-dark ">
        <q-card-section>
            <div class="text-h5">
              <b v-if="answerPercentage == 100">Perfect!</b>
              <b v-else-if="answerPercentage < 100 && answerPercentage >= 50">Good!</b>
              <b v-else-if="answerPercentage < 50">You could better</b>
            </div>
            <div><b>Your result: </b></div>
            <div class="text-h5"><b>{{ lesson.active.page?.answers?.totals.total }}</b> <q-icon name="star"></q-icon></div>
        </q-card-section>
    </q-card>
    <q-toolbar
        v-if="lesson.active.page && (lesson.active.page?.header?.page_template !== 'chat' || lesson.active.page?.answers?.is_finished)">
        <q-fab
          v-model="extraActions"
          class="q-mr-sm"
          vertical-actions-align="left"
          color="grey"
          push
          icon="more_vert"
          direction="up"
        >
          <q-fab-action
                :disable="(
                    !lesson.active.page?.answers?.is_finished
                    || lesson.active.page?.exercise?.again_attempts == 0
                )"
                push color="secondary" @click="againDialog=true" icon="replay" label="Start again" label-position="right">

              <q-avatar
                  size="sm"
                  :color="(lesson.active.page?.exercise?.again_attempts > 1) ? 'positive' : 'negative' "
                  text-color="white"
              >
                  {{ lesson.active.page?.exercise?.again_attempts }}
              </q-avatar>
          </q-fab-action>
          <q-fab-action
            :disable="(
            lesson.active.page?.exercise?.current_page == 0
            || lesson.active.page?.exercise?.back_attempts == 0
            )"
            push color="primary" @click="backDialog = true;" icon="arrow_back" label="Previous exercise" label-position="right">
              <q-avatar
                  size="sm"
                  :color="(lesson.active.page?.exercise?.back_attempts > 1) ? 'positive' : 'negative' "
                  text-color="white"
              >
              {{ lesson.active.page?.exercise?.back_attempts }}
          </q-avatar></q-fab-action>

        </q-fab>
        <q-btn
            v-if="(
                (!lesson.active.page?.fields
                || lesson.active.page?.answers?.is_finished)
                && lesson.active.page?.exercise?.current_page !== lesson.active.page?.exercise?.total_pages - 1
            )"
            push
            style="flex: 2"
            color="positive"
            label="Next"
            @click="next"
        ></q-btn>
        <q-btn
            v-if="(
                lesson.active.page?.fields
                && !lesson.active.page?.answers?.is_finished
            )"
            push
            style="flex: 2"
            color="primary"
            label="Confirm"
            @click="confirm"
        ></q-btn>
        <q-btn
            v-if="(
                (!lesson.active.page?.fields
                || lesson.active.page?.answers?.is_finished)
                && lesson.active.page?.exercise?.current_page == lesson.active.page?.exercise?.total_pages - 1
            )"
            push
            style="flex: 2"
            color="positive"
            icon="done_all"
            label="Finish"
            @click="next"
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

    <q-dialog v-model="againDialog"  transition-show="scale" transition-hide="scale">
      <q-card class="bg-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">Refresh the answer?</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          Your current answer will be refreshed. Are you sure?
        </q-card-section>
        <q-card-actions align="center">
          <q-btn push class="col" flat label="Cancel" v-close-popup />
          <q-btn push class="col" color="primary" label="Refresh" @click="again" v-close-popup />
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
const againDialog = ref(false)
const confirmDialog = ref(false)

const extraActions = ref(false)

const emits = defineEmits(['onPageChanged', 'onAnswerSaved', 'onDialogOpened'])
const props = defineProps({
  pageAnswers: Object
})

const answerPercentage = computed(() => lesson.active.page?.answers?.totals.correct * 100 / lesson.active.page?.answers?.totals.answers)

const isEmptyAnswer = computed(() => { for (const i in props.pageAnswers) { if (props.pageAnswers[i].value === '') return true } return false })
const { lesson } = useLesson()

const next = async () => {
  emits('onPageChanged', 'next')
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
const back = async () => {
  emits('onPageChanged', 'previous')
  extraActions.value = false
}
const again = async () => {
  emits('onPageChanged', 'again')
  extraActions.value = false
}

onBeforeRouteLeave((to, from) => {
  if (backDialog.value) {
    backDialog.value = false
    return false
  }
  if (againDialog.value) {
    againDialog.value = false
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
watch(() => againDialog.value, (newValue, oldValue) => {
  emits('onDialogOpened', newValue)
})
watch(() => confirmDialog.value, (newValue, oldValue) => {
  emits('onDialogOpened', newValue)
})
</script>
