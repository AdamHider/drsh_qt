<template>
  <q-page-container>
    <q-app-header class="transparent text-white rounded-b-md " reveal>
        <UserResourceBar :resource="user.active?.data.resources.cobalt"/>
        <UserResourceBar :resource="user.active?.data.resources.rubidium"/>
        <UserResourceBar :resource="user.active?.data.resources.science"/>
    </q-app-header>
    <q-page style="padding-top: 50px; padding-bottom: 35px;" class="bg-white flex column justify-center content-end  text-center full-width">
      <q-card flat class="relative  text-left q-pb-md rounded-borders rounded-b-0 col full-width">
          <q-card-section class="q-pa-none">
            <q-tabs v-model="tab"  inline-label align="center">
              <q-tab :name="categorIndex" v-for="(category, categorIndex) in skills" :key="categorIndex" :class="`text-${category.color}`" >
                <b>{{ category.title }}</b>
                <q-badge v-if="category.available_total > 0" class="q-ml-sm" :color="category.color" >{{ category.available_total }}</q-badge>
              </q-tab>
            </q-tabs>
            <q-tab-panels v-model="tab">
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
