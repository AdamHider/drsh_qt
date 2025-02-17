<template>
  <q-page-container>
      <div class="page-background">
        <div class="planet-container">
        </div>
        <div class="clouds-container">
        </div>
      </div>
      <q-app-header class="transparent text-white rounded-b-md " >
          <q-toolbar-title></q-toolbar-title>
          <q-btn flat round dense icon="settings" class="q-mr-sm"  to="/user/settings"/>
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
                    <img :src="user.active.data?.settings?.avatarImage?.value">
                  </q-avatar>
                </q-card-section>
            </q-card>
          </transition>

          <transition
            appear
            enter-active-class="animated fadeInUpBig"
            leave-active-class="animated fadeOutDownBig">
          <q-card flat square class="relative text-left q-pt-md q-pb-md col full-width no-shadow user-card">
              <q-card-section class="text-center q-pa-none">
                <div class="text-h6"><b>{{ user.active?.data.username }}</b></div>
                <div class="text-caption">
                  {{ user.active?.data.character?.title }}
                </div>
              </q-card-section>
              <q-card-section class="q-pb-none" style="width: 80%; margin: 0 auto">
                <q-progress-bar :value="user.active.data.level?.percentage" size="25px" color="positive"/>
                <div class="row q-ma-sm ">
                    <div class="col text-left">
                        <b>Level {{user.active.data.level?.level}}</b>
                    </div>
                    <div class="col text-right">
                        <b>{{user.active.data.level?.experience}}/{{user.active.data.level?.points_to}}</b>
                    </div>
                </div>
              </q-card-section>

              <q-card-section class="q-pa-none">
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
              <q-card-section class="q-py-none ">
                  <div class="text-h6">Effects</div>
              </q-card-section>
              <q-card-section class="q-py-none ">
                  <div class="text-h6">Resources</div>
              </q-card-section>
              <q-card-section class="q-pa-none">
                  <div class="q-pa-sm row items-start">
                      <div class="col-6 q-pa-sm">
                          <UserResourceBar :resource="user.active?.data.resources.energy" size="38px"/>
                      </div>
                      <div class="col-6 q-pa-sm">
                          <UserResourceBar :resource="user.active?.data.resources.cobalt" size="38px"/>
                      </div>
                      <div class="col-6 q-pa-sm">
                          <UserResourceBar :resource="user.active?.data.resources.rubidium" size="38px"/>
                      </div>
                      <div class="col-6 q-pa-sm">
                          <UserResourceBar :resource="user.active?.data.resources.science" size="38px"/>
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
          </q-card>
          </transition>
      </q-page>
  </q-page-container>
</template>

<script setup>
import { useUserStore } from '../stores/user'
import AchievementSlider from '../components/AchievementSlider.vue'
import UserResourceBar from '../components/UserResourceBar.vue'
import { useRoute } from 'vue-router'
import { onMounted, onBeforeMount, onActivated, ref, watch } from 'vue'

const { user, signOut } = useUserStore()
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
<style scoped>
.page-background{
    position: fixed;
    width: 100%;
    height: 100%;
    background: url("https://mektepium-app.local/image/backgrounds/space1.png");
}
.page-background .planet-container{
    position: absolute;
    background-image: url("https://mektepium-app.local/image/planets/home/planet1.png");
    width: 100%;
    height: 100%;
    background-size: 450px;
    background-repeat: no-repeat;
    background-position: center;
    z-index: 2;
}

.page-background .clouds-container{
  background: linear-gradient(to top, #250346, #0000) !important;
  height: 25%;
  z-index: 3;
  position: absolute;
  width: 100%;
  top: 32%;
}
.user-card::before{
    content: "";
    position: absolute;
    background-image: url("https://mektepium-app.local/image/backgrounds/clouds2.png");
    width: 100%;
    height: 100%;
    background-size: 150%;
    background-position: center bottom;
    background-repeat: no-repeat;
    bottom: 100%;
}
</style>
