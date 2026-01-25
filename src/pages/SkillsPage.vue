<template>
  <q-page-wrapper>
    <q-app-header class="transparent text-white rounded-b-md" reveal :showForce="headerShowForce" contentClass="justify-between">
      <q-btn v-if="route.query.back_link" flat icon="arrow_back"  @click="$router.go(-1);" v:slot="back-button"  @click.stop="playAudio('click')"/>
      <div v-else></div>
      <div class="flex full-width justify-center">
        <UserResourceBar v-if="user.active?.data.resources" :resource="user.active?.data.resources.terralit" dense no-caption size="24px" push />
        <UserResourceBar v-if="user.active?.data.resources" :resource="user.active?.data.resources.science" dense no-caption size="24px" push class="q-mx-sm"/>
        <UserResourceBar v-if="user.active?.data.resources" :resource="user.active?.data.resources.isonit" dense no-caption size="24px" push  badge-link="/market" with-badge/>
      </div>
    </q-app-header>
    <q-page class="column justify-center content-start text-center full-width" style="padding-top: 50px; padding-bottom: 35px;">
      <div class="page-background fixed-top full-width"  style="height: 300px; background-image: url('/images/skills/main_background7.jpg'); background-size: cover;"></div>
      <q-card class="text-center transparent no-shadow full-width justify-center column " style="position: relative;">
          <q-card-section class="text-white text-left flex flex-no-wrap items-center q-pa-none q-pt-md">
            <div class="col">
              <q-img width="200px" src="/images/skills/character.png" style="max-width: 100%;"/>
            </div>
            <div class="col q-pa-sm"  style="text-shadow: 2px 2px 5px black;">
              <div class="text-h6"><b>Лаборатория</b></div>
              <div class="text-caption">Только вверх, к звёздам!</div>
            </div>
          </q-card-section>
      </q-card>
      <q-card flat class="q-main-card relative text-left q-pt-md q-pb-md rounded-borders rounded-b-0 full-width" style="flex: 1;">
          <q-inner-loading :showing="notLoaded">
            <q-spinner-puff size="50px" color="primary" />
          </q-inner-loading>
          <q-card-section class="q-pa-none">
            <SkillList :list="skills" @onClaim="reload()" @onModalOpen="(value) => {headerShowForce = value}" :targetId="targetId"/>
          </q-card-section>
      </q-card>
    </q-page>
  </q-page-wrapper>
</template>

<script setup >
import SkillList from '../components/SkillList.vue'
import UserResourceBar from '../components/UserResourceBar.vue'
import { ref, onActivated, watch } from 'vue'
import { api } from '../services/index'
import { useUserStore } from '../stores/user'
import { playAudio } from 'src/services/audioService';
import { useRoute } from 'vue-router'

const route = useRoute()
const { user, getItem } = useUserStore()

const skills = ref([])
const error = ref(false)
const headerShowForce = ref(false)
const notLoaded = ref(true)
const targetId = ref(0)

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
  await load()
  if(route.query.target_id){
    targetId.value = route.query.target_id*1
  }
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
