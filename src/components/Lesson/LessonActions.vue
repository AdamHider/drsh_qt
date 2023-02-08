<template>
    <q-card v-if="lesson.active.page?.answers?.is_finished" flat class="bg-white text-dark ">
        <q-card-section>
            <div class="text-h5">
              <b v-if="answerPercentage == 100">Perfect!</b>
              <b v-else-if="answerPercentage > 100 && answerPercentage >= 50">Good!</b>
              <b v-else-if="answerPercentage < 50">You could better</b>
            </div>
            <div><b>Your result: </b></div>
            <div class="text-h5"><b>{{ lesson.active.page?.answers?.totals.total }}</b> <q-icon name="star"></q-icon></div>
        </q-card-section>
    </q-card>
    <q-toolbar
        v-if="lesson.active.page && (lesson.active.page?.header?.page_template !== 'chat' || lesson.active.page?.answers?.is_finished)">
        <q-btn-dropdown v-model="extraActions" class="q-mr-md" color="grey"  dropdown-icon="more_vert">
            <q-list>
                <q-item clickable
                    :disable="(
                    lesson.active.page?.exercise?.current_page == 0
                    || lesson.active.page?.exercise?.back_attempts == 0
                    )"
                    @click="backDialog = true">
                    <q-item-section>
                        <q-item-label>Previous exercise</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                        <q-avatar
                            size="sm"
                            :color="(lesson.active.page?.exercise?.back_attempts > 1) ? 'positive' : 'negative' "
                            text-color="white"
                        >
                            {{ lesson.active.page?.exercise?.back_attempts }}
                        </q-avatar>
                    </q-item-section>
                </q-item>
                <q-item clickable
                    :disable="(
                        !lesson.active.page?.answers?.is_finished
                        || lesson.active.page?.exercise?.again_attempts == 0
                    )"
                    @click="againDialog=true">
                    <q-item-section>
                        <q-item-label>Again</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                        <q-avatar
                            size="sm"
                            :color="(lesson.active.page?.exercise?.again_attempts > 1) ? 'positive' : 'negative' "
                            text-color="white"
                        >
                            {{ lesson.active.page?.exercise?.again_attempts }}
                        </q-avatar>
                    </q-item-section>
                </q-item>
            </q-list>
        </q-btn-dropdown>
        <q-btn
            v-if="(
                (!lesson.active.page?.fields
                || lesson.active.page?.answers?.is_finished)
                && lesson.active.page?.exercise?.current_page !== lesson.active.page?.exercise?.total_pages - 1
            )"
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
            style="flex: 2"
            color="primary"
            label="Finish"
            @click="next"
        ></q-btn>
    </q-toolbar>

    <q-dialog v-model="backDialog"  transition-show="scale" transition-hide="scale">
      <q-card class="bg-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">Are you sure?</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          You are gonna go back. You reaaly want to?
        </q-card-section>
        <q-card-actions align="center" class="bg-white text-teal">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn flat label="Continue" @click="back" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="againDialog"  transition-show="scale" transition-hide="scale">
      <q-card class="bg-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">Persistent</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          Click/Tap on the backdrop.
        </q-card-section>
        <q-card-actions align="center" class="bg-white text-teal">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn flat label="Continue" @click="again" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="confirmDialog"  transition-show="scale" transition-hide="scale">
      <q-card class="bg-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">Persistent</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          Click/Tap on the backdrop.
        </q-card-section>
        <q-card-actions align="center" class="bg-white text-teal">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn flat label="Continue" @click="confirm" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

</template>

<script setup>
import { useLesson } from '../../composables/useLesson'
import { computed, ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

const backDialog = ref(false)
const againDialog = ref(false)
const confirmDialog = ref(false)

const extraActions = ref(false)

const emits = defineEmits(['onPageChanged', 'onAnswerSaved'])
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
</script>
