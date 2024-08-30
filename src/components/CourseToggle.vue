<template  withBackground="true">
    <q-chip class="transparent no-shadow"
      style="color: inherit"
      clickable
      @click="dialog = true"
    >
        <q-avatar v-if="course.active?.image" size="30px">
          <img :src="course.active?.image"/>
        </q-avatar>
        <div v-if="course.active?.id" class="ellipsis" style="max-width: 100px;">
            <b>{{course.active?.title}}</b>
            <q-tooltip>{{course.active?.title}}</q-tooltip>
        </div>
        <div v-else>
            <b>Choose course</b>
        </div>
          <q-icon name="expand_more" size="sm"></q-icon>
    </q-chip>
    <q-dialog v-model="dialog" position="bottom"
      transition-show="slide-up" transition-hide="slide-down">
      <q-card>
        <q-card-section>
          <div class="text-h6">Choose course</div>
        </q-card-section>
        <q-card-section class="q-pt-none q-px-none relative-position scroll" style="height: 50vh">
          <q-inner-loading
              style="z-index: 300"
              :showing="course.isLoading"
              label="Please wait..."
              label-class="text-teal"
              label-style="font-size: 1.1em"
            />
          <CourseList @select="select"/>
        </q-card-section>
        <q-page-sticky v-if="course.active" position="bottom" :offset="[0, 18]">
          <q-btn fab push color="negative" icon="close" v-close-popup/>
        </q-page-sticky>
      </q-card>
    </q-dialog>
</template>

<script setup>
import { watch, ref } from 'vue'
import { useCourse } from '../composables/useCourse'
import CourseList from '../components/CourseList.vue'
import AppBackground from 'components/AppBackground.vue'

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

</script>
