<template>
    <q-toolbar class="bg-white " v-if="lesson.active.page">
        <div class="row">
            <q-btn
                v-if="(
                    lesson.active.page?.exercise.data.current_page != 0
                    && lesson.active.page?.exercise.data.back_attempts > 0
                )"
                flat
                class="col"
                text-color="dark"
                label="Back"
                @click="back"
            ></q-btn>
            <q-btn
                v-if="(
                    (!lesson.active.page?.fields
                    || lesson.active.page?.answers.is_finished)
                    && lesson.active.page?.exercise.data.current_page !== lesson.active.page?.exercise.data.total_pages - 1
                )"
                flat
                class="col"
                text-color="dark"
                label="Next"
                @click="next"
            ></q-btn>
            <q-btn
                v-if="(
                    lesson.active.page?.fields
                    && !lesson.active.page?.answers.is_finished
                    && lesson.active.page?.exercise.data.current_page !== lesson.active.page?.exercise.data.total_pages - 1
                )"
                flat
                class="col"
                text-color="dark"
                label="Confirm"
                @click="confirm"
            ></q-btn>
            <q-btn
                v-if="(
                    lesson.active.page?.fields
                    && !lesson.active.page?.answers.is_finished
                    && lesson.active.page?.exercise.data.current_page !== lesson.active.page?.exercise.data.total_pages - 1
                    && lesson.active.page?.exercise.data.skip_attempts > 0
                )"
                flat
                class="col"
                text-color="dark"
                label="Skip"
            ></q-btn>
        </div>
    </q-toolbar>
</template>

<script setup>
import { useLesson } from '../../composables/useLesson'

const emits = defineEmits(['onPageChanged', 'onAnswerSaved'])

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
