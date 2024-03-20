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
            <q-card class="transparent no-shadow full-width" style="margin-bottom: -60px; position: relative; z-index: 1; padding-top: 20vh;" >
                <q-card-section class="text-left text-white">
                <div class="text-h6"><b>Hello, {{ user.active?.data.username }}</b></div>
                <div class="text-caption">How are you doing?</div>
                </q-card-section>
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
          <q-card flat square class="relative text-left q-pt-md q-pb-md col full-width no-shadow user-card" style="padding-top: 30px;">
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
              <q-card-section class="q-pa-none">
                  <div class="q-pa-sm row items-start">
                      <div class="col-6 q-pa-sm">
                          <q-item  :class="`bg-light-gradient-${user.active?.data.resources.energy?.color} text-white rounded-borders`" >
                              <q-item-section avatar>
                                  <q-img width="38px" src="https://cdn-icons-png.flaticon.com/128/2626/2626096.png" style="filter: hue-rotate(0deg) drop-shadow(1px 3px 3px #00000075 );;"/>
                              </q-item-section>
                              <q-item-section>
                                  <q-item-label class="text-h7"><b>{{user.active?.data.resources.energy?.quantity}}</b></q-item-label>
                                  <q-item-label caption lines="1" class="text-white text-sm"><b>{{user.active.data.resources.energy?.title}}</b></q-item-label>
                              </q-item-section>
                          </q-item>
                      </div>
                      <div class="col-6 q-pa-sm">
                          <q-item  :class="`bg-light-gradient-${user.active?.data.resources.cobalt?.color} text-white rounded-borders`" >
                              <q-item-section avatar>
                                  <q-img width="30px" src="https://cdn-icons-png.flaticon.com/128/4858/4858971.png" style="filter: hue-rotate(61deg) drop-shadow(1px 3px 3px #00000075 );;"/>
                              </q-item-section>
                              <q-item-section>
                                  <q-item-label class="text-h7 "><b>{{user.active?.data.resources.cobalt?.quantity}}</b></q-item-label>
                                  <q-item-label caption lines="1" class="text-white text-sm"><b>{{user.active.data.resources.cobalt?.title}}</b></q-item-label>
                              </q-item-section>
                          </q-item>
                      </div>
                      <div class="col-6 q-pa-sm">
                          <q-item  :class="`bg-light-gradient-${user.active?.data.resources.rubidium?.color} text-white rounded-borders`" >
                              <q-item-section  avatar>
                                  <q-img width="30px" src="https://cdn-icons-png.flaticon.com/128/4858/4858971.png" style="filter: hue-rotate(178deg) drop-shadow(1px 3px 3px #00000075 );;"/>
                              </q-item-section>
                              <q-item-section>
                                  <q-item-label class="text-h7 "><b>{{user.active.data.resources.rubidium?.quantity}}</b></q-item-label>
                                  <q-item-label caption lines="1" class="text-white text-sm"><b>{{user.active.data.resources.rubidium?.title}}</b></q-item-label>
                              </q-item-section>
                          </q-item>
                      </div>
                      <div class="col-6 q-pa-sm">
                          <q-item  :class="`bg-light-gradient-${user.active?.data.resources.science?.color} text-white rounded-borders`" >
                              <q-item-section avatar>
                                  <q-img width="35px" src="https://cdn-icons-png.flaticon.com/128/3655/3655592.png" style="filter: hue-rotate(0deg) drop-shadow(1px 3px 3px #00000075 );"/>
                              </q-item-section>
                              <q-item-section>
                                  <q-item-label class="text-h7 "><b>{{user.active.data.resources.science?.quantity}}</b></q-item-label>
                                  <q-item-label caption lines="1" class="text-white text-sm"><b>{{user.active.data.resources.science?.title}}</b></q-item-label>
                              </q-item-section>
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
          </q-card>
          </transition>
      </q-page>
  </q-page-container>
</template>

<script setup>
import { useUserStore } from '../stores/user'
import UserToggle from '../components/UserToggle.vue'
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
    background: linear-gradient(to top, #7af3ff, #307ed0, #080042);
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
