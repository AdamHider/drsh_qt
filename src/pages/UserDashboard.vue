<template>
  <q-page-container>
      <q-app-header class="transparent text-white rounded-b-md " reveal>
          <UserToggle v-if="user.active.data"/>
          <q-toolbar-title></q-toolbar-title>
          <q-btn flat round dense icon="settings" class="q-mr-sm"  to="/user/settings"/>
      </q-app-header>
      <q-page style="padding-top: 50px; padding-bottom: 48px;" class="text-center flex column full-width">
          <transition
            appear
            enter-active-class="animated zoomIn animation-delay-1"
            leave-active-class="animated zoomOut">
            <q-card class="transparent no-shadow full-width" style="margin-bottom: -60px; position: relative; z-index: 1;">
                <q-card-section>
                    <q-img
                        :src="user.active.data?.character?.image"
                        style="max-width: 250px; width: 170px;"
                        no-spinner
                    />
                </q-card-section>
            </q-card>
          </transition>

          <transition
            appear
            enter-active-class="animated fadeInUpBig"
            leave-active-class="animated fadeOutDownBig">
          <q-card class="relative text-left q-pt-md q-pb-md rounded-borders rounded-b-0 col full-width" style="padding-top: 30px;">
              <q-card-section class="q-pb-none" style="width: 80%; margin: 0 auto">
              <q-linear-progress
                  color="positive"
                  :value="(user.active.data.level?.percentage / 100)"
                  size="12px"
                  stripe rounded
              ></q-linear-progress>
              <div class="row q-ma-sm ">
                  <div class="col text-left">
                      <b>Level {{user.active.data.level?.level}}</b>
                  </div>
                  <div class="col text-right">
                      <b>{{user.active.data.level?.experience}}/{{user.active.data.level?.points_to}}</b>
                  </div>
              </div>
              </q-card-section>
              <q-card-section>
                  <q-item class="q-pa-none">
                      <q-item-section avatar>
                        <q-avatar>
                          <img :src="user.active.data?.character.avatar"/>
                        </q-avatar>
                      </q-item-section>
                      <q-item-section class="text-left">
                          <div class="text-h5"><b>{{user.active.data.username}}</b></div>
                          <div class="text-grey">Active student</div>
                      </q-item-section>
                      <q-item-section side>
                          <q-btn flat to="user/edit" icon="edit"/>
                      </q-item-section>
                  </q-item>
              </q-card-section>
              <q-card-section class="q-pa-none">
                  <div class="q-pa-sm row items-start">
                      <div class="col-6 q-pa-sm">
                          <q-item  class="bg-grey-2 rounded-borders">
                              <q-item-section  avatar>
                                  <q-icon size="32px" color="primary" name="payments"></q-icon>
                              </q-item-section>
                              <q-item-section>
                                  <q-item-label class="text-h5 text-primary"><b>{{user.active?.data.resources.credits?.quantity}}</b></q-item-label>
                                  <q-item-label caption lines="2">Credits</q-item-label>
                              </q-item-section>
                              <q-tooltip activator="parent" location="top">
                                  Total exercises that you have done
                              </q-tooltip>
                          </q-item>
                      </div>
                      <div class="col-6 q-pa-sm">
                          <q-item  class="bg-grey-2 rounded-borders">
                              <q-item-section avatar>
                                  <q-icon size="32px" color="primary" name="diamond"></q-icon>
                              </q-item-section>
                              <q-item-section>
                                  <q-item-label class="text-h5 text-primary"><b>{{user.active?.data.resources.gems?.quantity}}</b></q-item-label>
                                  <q-item-label caption lines="2">Gems</q-item-label>
                              </q-item-section>
                              <q-tooltip activator="parent" location="top">
                                  Total exercises that you have done
                              </q-tooltip>
                          </q-item>
                      </div>
                      <div class="col-6 q-pa-sm">
                          <q-item  class="bg-grey-2 rounded-borders">
                              <q-item-section  avatar>
                                  <q-icon size="32px" color="primary" name="public"></q-icon>
                              </q-item-section>
                              <q-item-section>
                                  <q-item-label class="text-h5 text-primary"><b>{{user.active.data.dashboard?.total_exercises}}</b></q-item-label>
                                  <q-item-label caption lines="2">Lessons</q-item-label>
                              </q-item-section>
                              <q-tooltip activator="parent" location="top">
                                  Total lessons that you have done
                              </q-tooltip>
                          </q-item>
                      </div>
                      <div class="col-6 q-pa-sm">
                          <q-item  class="bg-grey-2 rounded-borders">
                              <q-item-section avatar>
                                  <q-icon size="32px" color="primary" name="people_alt"></q-icon>
                              </q-item-section>
                              <q-item-section>
                                  <q-item-label class="text-h5 text-primary"><b>{{user.active.data.dashboard?.total_classrooms}}</b></q-item-label>
                                  <q-item-label caption lines="2">Classrooms</q-item-label>
                              </q-item-section>
                              <q-tooltip activator="parent" location="top">
                                  Total classrooms that you are member of
                              </q-tooltip>
                          </q-item>
                      </div>
                  </div>
              </q-card-section>
              <q-card-section class="q-py-none flex justify-between items-center">
                  <div class="text-h6">Achievements</div>
                  <router-link to="/achievements">Show all</router-link>
              </q-card-section>
                  <AchievementSlider
                      :slidesPerView=2.4
                      :centerAligned="false"
                      :withButton="false"
                      slideHeight="100"
                      :navigation="false"
                      captionMode="full"
                  />
              <q-card-section>
                  <q-btn
                      class="full-width"
                      color="primary"
                      @click="exitUser(); "
                      append-icon="mdi-logout-variant"
                      label="Sign out"
                  />
              </q-card-section>
          </q-card>
          </transition>
      </q-page>
  </q-page-container>
</template>

<script setup>
import { useUserStore } from '../stores/user'
import UserToggle from '../components/UserToggle.vue'
import AchievementSlider from '../components/AchievementSlider.vue'
import { useRouter, useRoute } from 'vue-router'
import { onMounted, onBeforeMount, onActivated, ref, watch } from 'vue'

const { user, signOut } = useUserStore()
const router = useRouter()
const exitUser = async function () {
  await signOut()
  return router.push('/authorization')
}
const route = useRoute()
const startTime = ref()
const endTime = ref()
const AchievementDialog = ref(false)

onBeforeMount(async () => {
  startTime.value = new Date()
})

onMounted(async () => {
  endTime.value = new Date()
  let timeDiff = endTime.value - startTime.value // in ms
  // strip the ms
  timeDiff /= 1000

  // get seconds
  console.log('UserDashboard: ' + timeDiff + ' mseconds')
})

onActivated(async () => {
  endTime.value = new Date()
  let timeDiff = endTime.value - startTime.value // in ms
  // strip the ms
  timeDiff /= 1000

  // get seconds
  console.log('UserDashboard: ' + timeDiff + ' mseconds')
})

watch(route, (to) => {
  startTime.value = new Date()
})

</script>
