<template>
    <q-btn
      padding="10px"
      size="md"
      icon="emoji_events"
      color="primary"
      @click="dialog = true"/>
            <keep-alive>
      <q-dialog v-model="dialog">
        <q-card  style="max-height: 50vh" v-show="dialog">
          <q-card-section class="q-pb-none flex justify-between items-center">
              <div class="text-h6">Achievements</div>
          </q-card-section>
          <q-card-section class="q-px-none">
                <AchievementList/>
          </q-card-section>
        </q-card>
      </q-dialog>
            </keep-alive>
</template>

<script setup>
import { watch, ref } from 'vue'
import AchievementList from '../components/AchievementList.vue'
import { onBeforeRouteLeave } from 'vue-router'

const dialog = ref(false)
onBeforeRouteLeave((to, from) => {
  if (dialog.value) {
    dialog.value = false
    return false
  }
  return true
})
</script>
