<template>
  <q-page-container>
      <q-app-header class="transparent text-white rounded-b-md " reveal>
          <UserToggle v-if="user.active.data"/>
          <q-toolbar-title></q-toolbar-title>
          <q-btn flat round dense icon="settings" class="q-mr-sm"  to="/user/settings"/>
      </q-app-header>
      <q-page style="padding-top: 50px; padding-bottom: 35px;" class="flex justify-center content-end  text-center full-width">
        <q-card class="transparent no-shadow full-width text-white" >
          <q-card-section>
              <q-item class="q-pa-none">
                  <q-item-section avatar>
                    <q-avatar>
                      <img :src="user.active.data?.character?.avatar"/>
                    </q-avatar>
                  </q-item-section>
                  <q-item-section class="text-left">
                      <div class="text-h5"><b>{{user.active.data.username}}</b></div>
                      <div class="text-grey">Active student</div>
                  </q-item-section>
                  <q-item-section side>
                      <q-btn flat to="user/edit" color="white" icon="edit"/>
                  </q-item-section>
              </q-item>
          </q-card-section>
          <q-card-section class="q-py-none flex justify-start items-center q-gutter-md">
            <div class="text-h6">Resources</div>
          </q-card-section>
          <q-card-section class="flex justify-start items-center q-gutter-md">
              <UserResourceBar :resource="user.active?.data.resources?.cobalt"/>
              <UserResourceBar :resource="user.active?.data.resources?.rubidium"/>
              <UserResourceBar :resource="user.active?.data.resources?.science"/>
          </q-card-section>
        </q-card>
          <transition
            appear
            enter-active-class="animated zoomIn animation-delay-1"
            leave-active-class="animated zoomOut">
            <q-card square class="transparent no-shadow full-width overflow-hidden">
                <q-card-section>
                    <q-img
                        class="relative"
                        :src="user.active.data?.character?.image"
                        style="max-width: 250px; width: 170px; margin-bottom: -100px; z-index: 1"
                        no-spinner
                    />
                </q-card-section>
                <q-card-section style="height: 170px">
                      <q-img
                          class="absolute"
                          src="http://mektepium-app.local/image/planets/planet_alive_5.png"
                          style="width: 140%; left: -20%; top: -20%;"
                          no-spinner
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
import UserResourceBar from '../components/UserResourceBar.vue'
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
