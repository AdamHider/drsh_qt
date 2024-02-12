<template>
  <q-app-header class="transparent text-white rounded-b-md" reveal>
    <UserToggle/>
    <q-toolbar-title></q-toolbar-title>
    <q-btn flat round dense class="q-mr-sm" icon="share"/>
  </q-app-header>
  <q-page class="text-center flex column full-width" style="padding-top: 50px">
    <q-card class="transparent no-shadow full-width" style="position: relative; z-index: 1;">
      <q-card-section class="q-pa-lg q-pb-xl text-white">
          <div class="text-h6"><b>Classrooms</b></div>
          <div class="text-caption">See your rating among others</div>
        </q-card-section>
    </q-card>
      <q-card flat class="relative text-left col q-pt-md q-pb-md rounded-borders rounded-b-0 full-width" >
          <q-card-section class="q-py-none flex justify-between items-center">
            <div class="text-h6">Latest quests</div>
          </q-card-section>
          <q-card-section class="q-pa-none">
              <QuestSlider
                :slidesPerView=1.2
                :centerAligned="false"
                slideHeight="140"
                captionMode="full"
              />
          </q-card-section>
          <q-card-section class="q-pb-none flex justify-between items-center">
              <div class="text-h6">Your classrooms</div>
          </q-card-section>
          <q-card-section class="q-pa-none">
            <ClassroomList/>
          </q-card-section>
      </q-card>
  </q-page>
</template>

<script setup >
import UserToggle from '../components/UserToggle.vue'
import ClassroomList from '../components/ClassroomList.vue'
import QuestSlider from '../components/QuestSlider.vue'

import { useRouter, useRoute } from 'vue-router'
import { onMounted, onBeforeMount, onActivated, ref, watch } from 'vue'

const route = useRoute()
const startTime = ref();
const endTime = ref();


onBeforeMount(async () => {
  startTime.value = new Date()
})

onMounted(async () => {
  endTime.value = new Date();
  var timeDiff = endTime.value - startTime.value; //in ms
  // strip the ms
  timeDiff /= 1000;

  // get seconds
  console.log("ClassroomDashboard: " + timeDiff + " mseconds");
})

onActivated(async () => {
  endTime.value = new Date();
  var timeDiff = endTime.value - startTime.value; //in ms
  // strip the ms
  timeDiff /= 1000;

  // get seconds
  console.log("ClassroomDashboard: " + timeDiff + " mseconds");
})

watch(route, (to) => {
  startTime.value = new Date()
})

</script>
