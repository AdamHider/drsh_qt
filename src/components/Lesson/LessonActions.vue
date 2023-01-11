<template>
    <q-card v-if="lesson.active.page?.answers?.is_finished" class="bg-white text-dark no-border-radius">
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
    <q-toolbar class="bg-white" v-if="lesson.active.page && (lesson.active.page?.header.page_template !== 'chat' || lesson.active.page?.answers?.is_finished)">
            <q-btn
                v-if="(
                    lesson.active.page?.exercise.data.current_page != 0
                    && lesson.active.page?.exercise.data.back_attempts > 0
                )"
                flat
                style="flex: 1"
                text-color="dark"
                label="Back"
                @click="back"
            ></q-btn>
            <q-btn
                v-if="(
                    (!lesson.active.page?.fields
                    || lesson.active.page?.answers?.is_finished)
                    && lesson.active.page?.exercise.data.current_page !== lesson.active.page?.exercise.data.total_pages - 1
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
                    lesson.active.page?.fields
                    && !lesson.active.page?.answers?.is_finished
                    && lesson.active.page?.exercise.data.current_page !== lesson.active.page?.exercise.data.total_pages - 1
                    && lesson.active.page?.exercise.data.skip_attempts > 0
                )"
                flat
                style="flex: 1"
                text-color="dark"
                label="Skip"
            ></q-btn>
            <q-btn
                v-if="(
                    (!lesson.active.page?.fields
                    || lesson.active.page?.answers?.is_finished)
                    && lesson.active.page?.exercise.data.current_page == lesson.active.page?.exercise.data.total_pages - 1
                )"
                style="flex: 2"
                color="primary"
                label="Finish"
                @click="next"
            ></q-btn>
    </q-toolbar>
</template>

<script setup>
import { useLesson } from '../../composables/useLesson'
import { computed } from 'vue'

const emits = defineEmits(['onPageChanged', 'onAnswerSaved'])

const answerPercentage = computed(() => lesson.active.page?.answers?.totals.correct * 100 / lesson.active.page?.answers?.totals.answers)

const { lesson } = useLesson()

const next = async () => {
  emits('onPageChanged', 'next')
}
const confirm = async () => {
  emits('onAnswerSaved')
}
const back = async () => {
  emits('onPageChanged', 'previous')
}
const skip = async () => {
  emits('onPageChanged', 'skip')
}

</script>
