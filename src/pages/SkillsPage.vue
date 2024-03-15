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
              <SkillList :list="skills" @onClaim="reload()"/>
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
