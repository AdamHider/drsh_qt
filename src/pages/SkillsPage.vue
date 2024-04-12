<template>
  <q-page-container>
    <q-app-header class=" rounded-b-md " reveal>
        <q-toolbar-title>Исследования</q-toolbar-title>
    </q-app-header>
    <q-page style="padding-top: 50px; padding-bottom: 35px;" class="bg-white">
      <div class="q-pb-md">
        <SkillList :list="skills" @onClaim="reload()"/>
      </div>
    </q-page>
  </q-page-container>
</template>

<script setup >
import SkillList from '../components/SkillList.vue'
import { ref, onActivated } from 'vue'
import { api } from '../services/index'
import UserResourceBar from '../components/UserResourceBar.vue'
import { useUserStore } from '../stores/user'
import { useNavigationHistory } from '../composables/useNavigationHistory'

const { user, getItem } = useUserStore()
const { getQuestsDataHash } = useNavigationHistory()

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
  getQuestsDataHash()
}
onActivated(() => {
  load()
})

</script>
