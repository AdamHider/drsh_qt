<template  withBackground="true">
    <q-item class="bg-dark-transparent q-py-xs  q-px-sm bg-dark-transparent-50 rounded-sm"
      style="color: inherit"
      clickable
      dense  @click.stop="playAudio('click')"
      @click="dialog = true"
    >
      <q-item-section avatar>
        <q-avatar>
          <q-img :src="course.active?.image"/>
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <div class="text-subtitle2 ellipsis" style="max-width: 100px;"><b>{{course.active?.title}}</b></div>
        <div lines="1" class="text-caption ellipsis" style="max-width: 140px;">{{course.active?.description}}</div>
      </q-item-section>
    </q-item>
    <q-dialog v-model="dialog" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card>
        <q-card-section>
          <div class="text-h6"><b>Выбери галактику</b></div>
        </q-card-section>
        <q-card-section class="q-pt-none q-px-none relative-position scroll" style="height: 50vh">
          <q-inner-loading
              style="z-index: 300"
              :showing="course.isLoading"
              label="Ищем созвездия..."
              label-class="text-primary"
              label-style="font-size: 1.1em"
            />
          <CourseList @select="select"/>
        </q-card-section>
        <q-page-sticky v-if="course.active" position="bottom" :offset="[0, 18]">
          <q-btn push class="q-pa-sm" color="negative" v-close-popup @click.stop="playAudio('click')">
            <q-avatar size="60px"><q-img src="images/icons/back_galaxy.png"/></q-avatar>
          </q-btn>
        </q-page-sticky>
      </q-card>
    </q-dialog>
</template>

<script setup>
import { watch, ref } from 'vue'
import { useCourse } from '../composables/useCourse'
import CourseList from '../components/CourseList.vue'
import { playAudio } from 'src/services/audioService';
import { onBeforeRouteLeave } from 'vue-router'

const emit = defineEmits(['update:dialogOpened', 'onSelect'])

const { course } = useCourse()
const props = defineProps({
  dialogOpened: Boolean
})

const dialog = ref(false)
if (props.dialogOpened) dialog.value = true

const select = (courseId) => {
  dialog.value = false
  emit('onSelect', courseId)
}
watch(props, () => {
  if (props.dialogOpened) dialog.value = true
})
watch(dialog, () => {
  emit('update:dialogOpened', dialog)
})

onBeforeRouteLeave((to, from) => {
  if (dialog.value) {
    dialog.value = false
    return false
  }
  return true
})
</script>
