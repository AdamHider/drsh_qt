<template  withBackground="true">
    <q-btn
      padding="10px"
      size="md"
      icon="task_alt"
      color="primary"
      @click="dialog = true"/>
    <q-dialog v-model="dialog">
      <q-card>
        <q-card-section class="q-pb-none flex justify-between items-center">
            <div class="text-h6">Active quests</div>
        </q-card-section>
        <q-card-section class="q-px-none">
          <QuestList :active-only="true"/>
        </q-card-section>
      </q-card>
    </q-dialog>
</template>

<script setup>
import { watch, ref } from 'vue'
import QuestList from '../components/QuestList.vue'
import { onBeforeRouteLeave } from 'vue-router'

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
onBeforeRouteLeave((to, from) => {
  if (dialog.value) {
    dialog.value = false
    return false
  }
  return true
})
</script>
