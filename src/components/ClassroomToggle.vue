<template  withBackground="true">
    <q-chip class="transparent no-shadow"  style="color: inherit"
        clickable
        @click="dialog = true"
    >
        <q-avatar size="30px">
          <img :src="classroom.active?.image"/>
        </q-avatar>
        <div class="ellipsis">
            <b>{{classroom.active?.title}}</b>
            <q-tooltip>{{classroom.active?.title}}</q-tooltip>
            <q-icon name="expand_more" size="sm"></q-icon>
        </div>
    </q-chip>
    <q-dialog v-model="dialog" position="top">
      <q-card>
        <q-card-section class="q-pb-none flex justify-between items-center">
            <div class="text-h6">Choose your classroom</div>
            <router-link :to="`/classrooms`">Show all</router-link>
        </q-card-section>
        <q-card-section class="q-px-none">
          <ClassroomSlider
            :slidesPerView=1.5
            :centerAligned="false"
            :withButton="false"
            slideHeight="130"
            :navigation="false"
            captionMode="full"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
</template>

<script setup>
import { watch, ref } from 'vue'
import { useClassroom } from '../composables/useClassroom'
import ClassroomSlider from '../components/ClassroomSlider.vue'

const { classroom } = useClassroom()

const dialog = ref(false)
const emit = defineEmits(['update:dialogOpened'])
const props = defineProps({
  dialogOpened: Boolean
})
if (props.dialogOpened) dialog.value = true

watch(props, () => {
  if (props.dialogOpened) dialog.value = true
})
watch(dialog, () => {
  emit('update:dialogOpened', dialog)
})
</script>
