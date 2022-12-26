<template  withBackground="true">
    <q-chip class="transparent no-shadow"
      style="color: inherit"
      clickable
      @click="dialog = true"
    >
        <q-avatar size="30px">
          <img :src="`${CONFIG.API_HOST}${course.active?.image}`"/>
        </q-avatar>
        <div v-if="course.active?.title" class="ellipsis" style="max-width: 100px;">
            <b>{{course.active?.title}}</b>
            <q-tooltip>{{course.active?.title}}</q-tooltip>
        </div>
        <div v-else>
            <b>Choose course</b>
        </div>
          <q-icon name="expand_more" size="sm"></q-icon>
    </q-chip>
    <q-dialog v-model="dialog" position="bottom" allow-focus-outside >
      <q-card>
        <q-card-section>
          <div class="text-h6">Choose course</div>
        </q-card-section>
        <q-card-section class="q-pt-none q-px-none relative-position ">
          <q-inner-loading
              style="z-index: 300"
              :showing="course.isLoading"
              label="Please wait..."
              label-class="text-teal"
              label-style="font-size: 1.1em"
            />
          <CourseSlider
            :slidesPerView=1.8
            :centerAligned="false"
            :withButton="false"
            slideHeight="140"
            :navigation="false"
            captionMode="full"
            @select="select"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
</template>

<script setup>
import { watch, ref, defineEmits } from 'vue'
import { useCourse } from '../composables/useCourse'
import CourseSlider from '../components/CourseSlider.vue'
import { CONFIG } from '../config.js'

const emit = defineEmits(['update:dialogOpened'])

const { course } = useCourse()
const props = defineProps({
  dialogOpened: Boolean
})

const dialog = ref(false)
if (props.dialogOpened) dialog.value = true

const select = () => {
  dialog.value = false
}

watch(props, () => {
  if (props.dialogOpened) dialog.value = true
})
watch(dialog, () => {
  emit('update:dialogOpened', dialog)
})

</script>
