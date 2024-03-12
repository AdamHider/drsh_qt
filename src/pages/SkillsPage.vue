<template>
  <q-page-container>

    <div class="page-background" style="
      position: fixed;
      width: 100%;
      height: 100%;
      background-image: url('http://mektepium-app.local/image/backgrounds/tech2.jpg');
      background-size: cover;
      background-position: center center;
      background-attachment: fixed;">
      <div style="
      position: fixed;
      width: 100%;
      height: 100%;
      background: #bd97021c;
      backdrop-filter: brightness(0.4) blur(2px);">
      </div>
    </div>
    <q-app-header class="transparent text-white rounded-b-md " reveal>
        <UserResourceBar :resource="user.active?.data.resources.cobalt"/>
        <UserResourceBar :resource="user.active?.data.resources.rubidium"/>
        <UserResourceBar :resource="user.active?.data.resources.science"/>
    </q-app-header>
    <q-page style="padding-top: 50px; padding-bottom: 35px;" class="flex column justify-center content-end  text-center full-width">
      <q-card class="text-center transparent no-shadow full-width" style="position: relative; z-index: 1;">
          <q-card-section class="q-pa-lg q-pb-xl text-white">
            <div class="text-h6"><b>Leaderboard</b></div>
            <div class="text-caption">See your rating among others</div>
          </q-card-section>
      </q-card>
      <q-card flat class="relative transparent text-left q-pb-md rounded-borders rounded-b-0 col full-width">
          <q-card-section class="q-pa-none">
            <q-tabs v-model="tab"  inline-label align="center">
              <q-tab :name="categorIndex" v-for="(category, categorIndex) in skills" :key="categorIndex" :class="`text-${category.color}`" >
                <b>{{ category.title }}</b>
                <q-badge v-if="category.available_total > 0" class="q-ml-sm" :color="category.color" >{{ category.available_total }}</q-badge>
              </q-tab>
            </q-tabs>
            <q-tab-panels class="bg-transparent" v-model="tab">
              <q-tab-panel :name="categorIndex" v-for="(category, categorIndex) in skills" :key="categorIndex">
                <SkillList :list="category.list" :color="category.color" @onClaim="reload()"/>
                </q-tab-panel>
              </q-tab-panels>
          </q-card-section>
      </q-card>
    </q-page>
  </q-page-container>
</template>

<script setup >
import SkillList from '../components/SkillList.vue'
import { ref, onActivated } from 'vue'
import { api } from '../services/index'
import UserResourceBar from '../components/UserResourceBar.vue'
import { useUserStore } from '../stores/user'

const { user, getItem } = useUserStore()

const tab = ref(0)
const skills = ref([])

const load = async function (filter) {
  const skillListResponse = await api.skill.getList({ mode: 'by_user' })
  if (skillListResponse.error) {
    error.value = skillListResponse
    skills.value = []
    return []
  }
  skills.value = skillListResponse
}
const reload = async function(){
  await getItem()
  load()
}
onActivated(() => {
  load()
})

</script>
