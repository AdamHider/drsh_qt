<template>
  <q-page-container>
      <div class="fixed-full">
        <AppBackground/>
      </div>
      <q-app-header class="transparent text-white rounded-b-md" reveal>
          <q-toolbar-title></q-toolbar-title>
          <div class="relative-position q-mr-sm">
            <q-btn flat round dense icon="person_add" @click="inviteDialog = true"/>
            <q-tutorial-item title="Пригласить друзей" description="Здесь можно пригласить друзей и получить большой подарок за каждого." :index="5" position="bottom" positionInline="right"/>
          </div>
          <q-btn flat round dense icon="settings" class="q-mr-sm" to="/user/settings">
          </q-btn>
      </q-app-header>
      <q-page style="padding-top: 50px; padding-bottom: 35px;" class="text-center flex column full-width">
          <transition
            appear
            enter-active-class="animated zoomIn animation-delay-1"
            leave-active-class="animated zoomOut">
            <q-card class="transparent no-shadow full-width" style="position: relative; z-index: 1;" >
                <q-card-section class="text-white">
                  <q-avatar
                    size="150px"
                    style="margin-bottom: -30px; box-shadow: 0px 0px 0px 4px white;">
                    <img :src="user.active?.data.character?.image">
                  </q-avatar>
                </q-card-section>
            </q-card>
          </transition>

          <transition
            appear
            enter-active-class="animated fadeInUpBig"
            leave-active-class="animated fadeOutDownBig">
          <q-card flat square class="relative text-left q-pt-md q-pb-lg col full-width no-shadow user-card">
              <q-card-section class="text-center q-pa-none">
                <div class="text-h6"><b>{{ user.active?.data.name }}</b></div>
                <div class="text-caption">
                  {{ user.active?.data.username }}
                </div>
              </q-card-section>
              <q-card-section class="q-pb-none " style="width: 80%; margin: 0 auto">
                <q-tutorial-item title="Уровень" description="Здесь отображается твой текущий уровень." :index="0"/>
                <q-progress-bar :value="user.active.data.level?.percentage" size="25px" color="positive"/>
                <div class="row q-ma-sm ">
                    <div class="col text-left">
                        <b>Уровень {{user.active.data.level?.level}}</b>
                    </div>
                    <div class="col text-right">
                        <b>{{user.active.data.level?.experience}}/{{user.active.data.level?.points_to}}</b>
                    </div>
                </div>
              </q-card-section>
              <q-card-section class="q-pa-none" v-if="user.active?.data.statistics">
                  <q-tutorial-item title="Базовая статистика" description="Количество исследованных планет, изученных технологий и количество набранных баллов." :index="1"/>
                  <div class="q-pa-sm row items-start border-between">
                      <div class="col-4">
                        <q-item class="rounded-borders text-center">
                          <q-item-section>
                              <q-item-label caption lines="1"><b>{{user.active?.data.statistics.total_points?.label}}</b></q-item-label>
                              <q-item-label class="text-h6"><b>{{user.active?.data.statistics.total_points?.value}}</b></q-item-label>
                          </q-item-section>
                        </q-item>
                      </div>
                      <div class="col-4">
                        <q-item class="rounded-borders text-center">
                          <q-item-section>
                              <q-item-label caption lines="1"><b>{{user.active?.data.statistics.total_exercises?.label}}</b></q-item-label>
                              <q-item-label class="text-h6"><b>{{user.active?.data.statistics.total_exercises?.value}}</b></q-item-label>
                          </q-item-section>
                        </q-item>
                      </div>
                      <div class="col-4">
                        <q-item class="rounded-borders text-center">
                          <q-item-section>
                              <q-item-label caption lines="1"><b>{{user.active?.data.statistics.total_skills?.label}}</b></q-item-label>
                              <q-item-label class="text-h6"><b>{{user.active?.data.statistics.total_skills?.value}}</b></q-item-label>
                          </q-item-section>
                        </q-item>
                      </div>
                  </div>
              </q-card-section>
              <div class="relative-position">
                <q-tutorial-item title="Ресурсы" description="Здесь отображается количество твоих ресурсов, которые нужны для исследований." :index="2" position="top"/>
                <q-card-section class="q-py-none q-pt-sm">
                    <div class="text-subtitle1"><b>Ресурсы</b></div>
                </q-card-section>
                <q-card-section class="q-pa-none" v-if="user.active?.data.resources">
                    <div class="q-pa-sm row items-start">
                        <div class="col-6 q-pa-sm">
                            <UserResourceBar :resource="user.active?.data.resources.energy" size="38px" push/>
                        </div>
                        <div class="col-6 q-pa-sm">
                            <UserResourceBar :resource="user.active?.data.resources.terralit" size="38px" push/>
                        </div>
                        <div class="col-6 q-pa-sm">
                            <UserResourceBar :resource="user.active?.data.resources.isonit" size="38px" badge-link="/market" with-badge push/>
                        </div>
                        <div class="col-6 q-pa-sm">
                            <UserResourceBar :resource="user.active?.data.resources.science" size="38px" push/>
                        </div>
                    </div>
                </q-card-section>
              </div>
              <div class="relative-position">
                <q-tutorial-item title="Эффекты" description="Здесь отображаются эффекты, которые помогают или мешают исследованию галактики." :index="3" position="top"/>
                <q-card-section class="q-py-none q-pt-sm">
                    <div class="text-subtitle1"><b>Активные эффекты</b></div>
                </q-card-section>
                <q-card-section class="q-pa-none q-pb-sm">
                    <UserSettingModifierSlider :modifiers="user.active?.data.modifiers"/>
                </q-card-section>
              </div>
              <div class="relative-position">
                <q-tutorial-item title="Достижения" description="Здесь будут отображаться заработанные достижения." :index="4" position="top"/>
                <q-card-section class="q-py-none flex justify-between items-center q-pt-sm">
                    <div class="text-subtitle1"><b>Достижения</b></div>
                    <router-link to="/achievements">Показать все</router-link>
                </q-card-section>
                <q-card-section class="q-pa-none q-pb-sm">
                    <AchievementList/>
                </q-card-section>
              </div>
          </q-card>
          </transition>
      </q-page>
      <q-dialog v-model="inviteDialog" position="bottom" transition-hide="fade" >
        <q-card v-if="userInvitation" class="relative-position allow-overflow rounded-b-0">
            <div class="absolute full-width text-center" style="bottom: 100%;">
              <q-img  width="200px" src="/images/market/character.png" style="max-width: 100%;"/>
            </div>
          <q-card-section>
            <div class="items-center text-center">
              <div class="text-subtitle1"><b>Пригласи друзей с выгодой!</b></div>
              <div class="text-caption">Друзья, которые присоединятся к приключениям по этой ссылке принесут драгоценный <b class="text-green">изонит</b>!</div>
              <div class="text-caption">Для этого приглашённым друзьям нужно только выполнить задание <b class="text-primary">"Час расплаты"</b>!</div>
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="text-caption text-grey">
              По вашему приглашению присоединились: {{ userInvitation.count }}
            </div>
          </q-card-section>
          <q-card-actions>
            <q-btn v-if="!userInvitationCopied" class="full-width" push color="primary" icon="content_copy" label="Скопировать ссылку" @click="copyInvitationLink()"/>
            <q-btn v-else class="full-width" push color="primary" label="Скопировано" icon="check" disabled/>
            <q-btn v-close-popup class="full-width q-my-sm" flat color="primary"><b>Закрыть</b></q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
      <UserTutorialDialog/>
  </q-page-container>
</template>

<script setup>
import { useUserStore } from '../stores/user'
import AchievementList from '../components/AchievementList.vue'
import UserResourceBar from '../components/UserResourceBar.vue'
import UserSettingModifierSlider from '../components/UserSettingModifierSlider.vue'
import UserTutorialDialog from '../components/Tutorials/UserTutorialDialog.vue'
import AppBackground from '../components/AppBackground.vue'

import { useRoute } from 'vue-router'
import { ref, watch, onMounted, onActivated, onBeforeMount } from 'vue'
import { copyToClipboard } from 'quasar'

const { user, getItem, getItemInvitation } = useUserStore()
const route = useRoute()


const inviteDialog = ref(false)
const userInvitation = ref({})
const userInvitationCopied = ref(false)

onMounted(async () => {
  endTime.value = new Date()
  let timeDiff = endTime.value - startTime.value // in ms
  // strip the ms
  timeDiff /= 1000

  // get seconds
  console.log('UserDashboard: ' + timeDiff + ' mseconds')
  await getItem()
})

onActivated(async () => {
  endTime.value = new Date()
  let timeDiff = endTime.value - startTime.value // in ms
  // strip the ms
  timeDiff /= 1000

  // get seconds
  console.log('UserDashboard: ' + timeDiff + ' mseconds')
  await getItem()
})
const copyInvitationLink = () => {
  const link = `https://mektepium.com/user-invitation-${userInvitation.value.hash}`
  copyToClipboard(link)
  userInvitationCopied.value = true
}
watch(() => inviteDialog.value, async () => {
  if(inviteDialog.value == false) return
  const userInvitationResponse = await getItemInvitation()
  if(!userInvitationResponse.error){
    userInvitation.value = userInvitationResponse
  }
  userInvitationCopied.value = false
})
const startTime = ref()
const endTime = ref()
const AchievementDialog = ref(false)

onBeforeMount(async () => {
  startTime.value = new Date()
})

watch(route, (to) => {
  startTime.value = new Date()
})
</script>
<style scoped>

.user-card::before{
    content: "";
    position: absolute;
    background-image: url("/images/clouds.png");
    width: 100%;
    height: 100%;
    background-size: 150%;
    background-position: center bottom;
    background-repeat: no-repeat;
    bottom: 99%;
}
</style>
