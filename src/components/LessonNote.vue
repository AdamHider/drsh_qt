<template>
  <q-btn push dense
    @click="showLessonNote()"
    size="sm"
    :class="`bg-gradient-primary text-white q-ma-sm cursor-pointer rounded-sm q-mt-sm`" >
      <div style="width: 40px" >
        <img src="/images/characters/codex_avatar.png" height="45px" class="absolute-bottom q-ml-sm q-mb-xs">
      </div>
      <q-icon class="q-py-xs q-px-sm" name="question_mark" size="24px"></q-icon>
  </q-btn>
  <q-dialog v-model="noteDialog"  transition-show="slide-right" transition-hide="slide-left" position="left">
      <q-card class="relative-position allow-overflow rounded-l-0" style="width: 320px">
        <q-img class="absolute" width="100px" style="bottom: 100%;" src="/images/characters/codex_full.png"/>
        <q-card-section class="q-pb-none">
          <div class="text-subtitle1"><b>Примечание</b></div>
          <div class="text-caption">{{ props.note }}</div>
        </q-card-section>
        <q-card-actions align="center" class="bg-white q-px-md q-pb-md text-teal">
          <q-btn class="full-width" push label="Понятно" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script setup>
import { useLesson } from "../composables/useLesson";
import { ref, onActivated, onMounted, toRef, watch } from "vue";
import { useCourse } from "../composables/useCourse";
import { useLoader } from '../composables/useLoader'
import { useRouter } from "vue-router";

const props = defineProps({
  note: String
})

const noteDialog = ref(false)

const showLessonNote = async function () {
  noteDialog.value = true
}
</script>
