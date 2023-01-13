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
        v-if="lesson.active.page && (lesson.active.page?.header.page_template !== 'chat' || lesson.active.page?.answers?.is_finished)">
        <q-btn-dropdown v-model="extraActions" class="q-mr-md" color="grey"  dropdown-icon="more_vert">
            <q-list>
                <q-item clickable
                    :disable="(
                    lesson.active.page?.exercise.data.current_page == 0
                    || lesson.active.page?.exercise.data.back_attempts == 0
                    )"
                    @click="back">
                    <q-item-section>
                        <q-item-label>Previous exercise</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                        <q-avatar
                            size="sm"
                            :color="(lesson.active.page?.exercise.data.back_attempts > 1) ? 'positive' : 'negative' "
                            text-color="white"
                        >
                            {{ lesson.active.page?.exercise.data.back_attempts }}
                        </q-avatar>
                    </q-item-section>
                </q-item>
                <q-item clickable
                    :disable="(
                        !lesson.active.page?.answers?.is_finished
                        || lesson.active.page?.exercise.data.again_attempts == 0
                    )"
                    @click="again">
                    <q-item-section>
                        <q-item-label>Again</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                        <q-avatar
                            size="sm"
                            :color="(lesson.active.page?.exercise.data.again_attempts > 1) ? 'positive' : 'negative' "
                            text-color="white"
                        >
                            {{ lesson.active.page?.exercise.data.again_attempts }}
                        </q-avatar>
                    </q-item-section>
                </q-item>
            </q-list>
        </q-btn-dropdown>
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

    <q-dialog v-model="skippedDialog">
        <q-card style="min-width: 300px">
            <q-card-section>
                <div class="text-h6">Choose skipped page</div>
            </q-card-section>
            <q-list lines="two">
                <q-item clickable v-ripple
                    v-for="(skippedPage, skippedPageIndex) in lesson.active.page?.exercise.data.skipped_pages" :key="skippedPageIndex">

                    <q-item-section>
                        <q-item-label lines="1"><b>{{skippedPage.index}}.</b> {{skippedPage.title}}</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                        <q-btn @click="openSkipped(skippedPage.index)">Open</q-btn>
                    </q-item-section>
                </q-item>
            </q-list>
            <q-card-actions align="right" class="bg-white text-teal">
                <q-btn flat label="CLOSE" v-close-popup />
            </q-card-actions>
        </q-card>

    </q-dialog>

</template>

<script setup>
import { useLesson } from '../../composables/useLesson'
import { computed, ref } from 'vue'

const skippedDialog = ref(false)
const extraActions = ref(false)

const emits = defineEmits(['onPageChanged', 'onAnswerSaved'])

const answerPercentage = computed(() => lesson.active.page?.answers?.totals.correct * 100 / lesson.active.page?.answers?.totals.answers)

const { lesson } = useLesson()

const next = async () => {
  emits('onPageChanged', 'next')
  extraActions.value = false
}
const confirm = async () => {
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
</script>
