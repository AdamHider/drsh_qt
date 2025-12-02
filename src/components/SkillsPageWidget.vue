<template>
    <q-card flat class="relative text-left q-pt-md q-pb-md rounded-borders rounded-b-0 full-width" style="flex: 1;">
      <q-inner-loading :showing="notLoaded">
        <q-spinner-puff size="50px" color="primary" />
      </q-inner-loading>
      <q-card-section class="q-py-none">
          <div class="text-h6"><b>Лаборатория</b></div>
          <div class="text-caption">Только вверх, к звёздам!</div>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <SkillList :list="skills" @onClaim="reload()" @onModalOpen="(value) => {headerShowForce = value}"/>
      </q-card-section>
    </q-card>
</template>

<script setup >
import SkillList from '../components/SkillList.vue'
import { useNavigationHistory } from '../composables/useNavigationHistory'
import UserResourceBar from '../components/UserResourceBar.vue'
import { ref, onActivated, onMounted, watch } from 'vue'
import { api } from '../services/index'
import { useUserStore } from '../stores/user'
import { playAudio } from 'src/services/audioService';

const { user, getItem } = useUserStore()
const { routes } = useNavigationHistory();

const skills = ref([])
const error = ref(false)
const headerShowForce = ref(false)
const notLoaded = ref(true)
const skillsDialog = ref(false)

const load = async function (filter) {
  const skillListResponse = await api.skill.getList({ mode: 'by_user' })
  notLoaded.value = false
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
}
onActivated(async () => {
  await getItem()
  load()
})
onMounted(async () => {
  await getItem()
  load()
})
</script>
<style scoped>
.q-main-card:before{
  content: "";
  position: absolute;
  z-index: 1;
  background: white;
  top: 100%;
  left: 0;
  width: 100%;
  height: 100px;
}
</style>
