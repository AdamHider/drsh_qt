<template>
  <q-page-container>
    <q-app-header class=" rounded-b-md " reveal>
        <q-toolbar-title><b>Исследования</b></q-toolbar-title>
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
import { useUserStore } from '../stores/user'
import { useNavigationHistory } from '../composables/useNavigationHistory'

const { getItem } = useUserStore()
const { getQuestsDataHash } = useNavigationHistory()

const skills = ref([])
const error = ref(false)

const load = async function (filter) {
  const skillListResponse = await api.skill.getList({ mode: 'by_user' })
  if (skillListResponse.error) {
    error.value = skillListResponse
    skills.value = []
    return []
  }
  skills.value = skillListResponse
}
const reload = async function () {
  await getItem()
  load()
  getQuestsDataHash()
}
onActivated(() => {
  load()
})

</script>
