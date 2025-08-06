<template>
    <q-list v-if="achievements?.length > 0">
      <q-item v-for="(achievementItem, index) in achievements" :key="index">
        <q-item-section>
          <q-card class="q-push">
            <q-card-section class="q-py-sm">
              <div :class="`flex justify-between q-pb-sm ${(achievementItem.progress.current >= achievementItem.progress.target) ? 'items-center' : 'items-end'}`">
                <div>
                  <div class="text-bold">{{achievementItem.title}}</div>
                  <div class="text-grey text-caption">{{achievementItem.description}}</div>
                </div>
                <b v-if="achievementItem.progress.current >= achievementItem.progress.target"><q-icon size="25px" color="positive" name="done"></q-icon></b>
                <b v-else>{{achievementItem.progress.current}}/{{achievementItem.progress.target}}</b>
              </div>
              <q-progress-bar :value="achievementItem.progress.percentage" size="25px" color="positive"/>
            </q-card-section>
          </q-card>
        </q-item-section>
      </q-item>
    </q-list>
    <BannerNotFound v-else
      title="Упс..."
      description="У вас пока нет достижений"
      default-image
    />
</template>
<script setup>
import { api } from '../services/index'
import { ref, onActivated } from 'vue'
import BannerNotFound from './BannerNotFound.vue'

const achievements = ref([])

const load = async function () {
  achievements.value = []
  const achievementListResponse = await api.achievement.getList({ mode: 'by_user', limit: 3 })
  if (!achievementListResponse.error) {
    achievements.value = achievementListResponse
  }
}
onActivated(() => {
  load()
})
</script>
