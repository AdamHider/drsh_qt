<template>
  <q-app-header class="transparent text-white rounded-b-md" reveal>
    <ClassroomToggle v-bind:dialogOpened="dialog.active" v-on:update:dialogOpened="dialog.active = $event"/>
    <q-toolbar-title></q-toolbar-title>
    <q-btn flat round dense class="q-mr-sm" icon="share"/>
    <q-btn flat round dense class="q-mr-sm"  icon="more_vert"/>
  </q-app-header>
  <q-page :class="(user.active?.data.profile?.classroom_id) ? 'bg-white' : 'row items-end full-height full-width text-center'"
      :style="(user.active?.data.profile?.classroom_id) ? `padding-top: ${backgroundImageHeight}px;` : ''">
    <q-img
      v-if="classroom?.active?.background_image"
      :src="classroom?.active?.background_image"
      :style="`max-height: ${backgroundImageHeight}px; position: fixed; top: 0;`"
    />
    <q-card v-if="user.active?.data.profile?.classroom_id" flat style="margin-top: -15px;">
      <q-card-section>
        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">
            {{ classroom.active?.description?.title }}
          </div>
          <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
            <q-icon name="place" />
            250 ft
          </div>
        </div>
        <div v-if="classroom.active?.description?.description" class="text-grey">
          {{ classroom.active?.description?.description }}
        </div>
        <div v-if="classroom.active?.address" class="text-caption text-grey">
          <q-icon name="location_on" size="sm"></q-icon>
          {{ classroom.active?.address }}
        </div>
        <div v-if="classroom.active?.institution" class="text-caption text-grey">
          <q-icon name="location_city" size="sm"></q-icon>
          {{ classroom.active?.institution }}
        </div>
      </q-card-section>
      <q-separator />
      <q-tabs
        v-model="tab"
        inline-label
      >
        <q-tab name="main" icon="grid_view" label="Main" />
        <q-tab name="leaderboard" icon="bar_chart" label="Score" />
      </q-tabs>
      <q-tab-panels v-model="tab" animated keep-alive>
        <q-tab-panel name="main" class="q-px-none" >
          <q-card flat>
            <q-card-section class="q-py-none flex justify-between items-center">
                <div class="text-h6">Homeworks</div>
                <router-link to="homeworks">Show all</router-link>
            </q-card-section>
            <q-card-section class="q-pa-none">
                <HomeworkSlider
                  :slidesPerView=2.3
                  :centerAligned="false"
                  :withButton="false"
                  slideHeight="150"
                  :navigation="false"
                  captionMode="full"
                />
            </q-card-section>
            <q-card-section class="q-py-none flex justify-between items-center">
                <div class="text-h6">Challenges</div>
                <router-link to="challenges">Show all</router-link>
            </q-card-section>
            <q-card-section class="q-pa-none">
                <ChallengeSlider
                  :slidesPerView=1.4
                  :centerAligned="false"
                  :withButton="false"
                  slideHeight="140"
                  :navigation="false"
                  captionMode="full"
                />
            </q-card-section>
          </q-card>
        </q-tab-panel>
        <q-tab-panel name="leaderboard">
          <q-card flat>
            <q-card-section class="q-py-none">
                <div class="text-h6">Leaderboard</div>
            </q-card-section>
            <q-card-section class="q-pa-none">
              <LeaderboardTable/>
            </q-card-section>
          </q-card>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
    <q-card v-else flat class="full-width transparent">
      <q-card-section class="text-white" >
        <div class="text-subtitle"><b>Choose classroom</b></div>
        <div class="text-caption">And start your investigation</div>
        <q-btn color="dark" @click="dialog.active=true">Choose</q-btn>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import ClassroomToggle from '../components/ClassroomToggle.vue'
import HomeworkSlider from '../components/HomeworkSlider.vue'
import ChallengeSlider from '../components/ChallengeSlider.vue'
import LeaderboardTable from '../components/LeaderboardTable.vue'
import { useClassroom } from '../composables/useClassroom'

import { useUserStore } from '../stores/user'
const { user } = useUserStore()

const dialog = reactive({ active: false })

const backgroundImageHeight = 200
const tab = ref('main')
const { classroom, getActive } = useClassroom()
getActive()
watch(() => user.active?.data.profile?.classroom_id, async (newData, oldData) => {
  getActive()
})
</script>
