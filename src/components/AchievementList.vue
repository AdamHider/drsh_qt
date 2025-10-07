<template>
    <q-list v-if="achievements?.length > 0">
      <q-item class="q-push q-ma-md rounded-md q-py-sm" v-for="(achievementItem, achievementIndex) in achievements" :key="`achievementIndex${achievementIndex}`">
        <q-item-section avatar v-if="achievementItem.image">
          <q-img :src="achievementItem.image"/>
        </q-item-section>
        <q-item-section>
              <div :class="`flex justify-between no-wrap q-pb-sm ${(achievementItem.progress.current >= achievementItem.progress.target) ? 'items-center' : 'items-end'}`">
                <div>
                  <div class="text-bold">{{achievementItem.title}}</div>
                  <div class="text-grey text-caption">{{achievementItem.description}}</div>
                </div>
                <b v-if="achievementItem.progress.current >= achievementItem.progress.target"><q-icon size="25px" color="positive" name="done"></q-icon></b>
                <b v-else>{{achievementItem.progress.current}}/{{achievementItem.progress.target}}</b>
              </div>
              <q-progress-bar :value="achievementItem.progress.percentage" size="25px" color="positive"/>
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
  const achievementListResponse = await api.achievement.getList({ mode: 'by_user', limit: 3 })
  if (!achievementListResponse.error) {
    achievements.value = achievementListResponse
  }
}
onActivated(() => {
  load()
})
</script>
