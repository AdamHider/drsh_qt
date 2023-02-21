<template>
  <q-app-header class="transparent text-white rounded-b-md" reveal>
    <ClassroomToggle v-bind:dialogOpened="dialog" v-on:update:dialogOpened="dialog = $event"/>
    <q-toolbar-title></q-toolbar-title>
    <q-btn flat round dense class="q-mr-sm" icon="share"/>
    <q-btn flat round dense class="q-mr-sm"  icon="more_vert"/>
  </q-app-header>
  <q-page :class="(classroom.active?.id) ? 'bg-white' : 'row items-end full-height full-width text-center'"
      :style="(classroom.active?.id) ? `padding-top: ${backgroundImageHeight}px;` : ''">
    <q-img
      v-if="classroom.active?.background_image"
      :src="classroom.active?.background_image"
      :style="`max-height: ${backgroundImageHeight}px; position: fixed; top: 0;`"
    />
    <q-card v-if="classroom.active?.id" flat style="margin-top: -15px;">
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
      <q-card-section>
        <q-btn v-if="!classroom.active?.is_subscribed" class="full-width" label="Subscribe" color="primary" icon="person_add"></q-btn>
        <q-btn v-else flat class="full-width" label="Subscribed" color="grey" icon="check"></q-btn>
      </q-card-section>
      <q-separator />
      <q-card-section v-if="classroom.active?.is_subscribed" class="q-pa-none">
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
                  <router-link :to="`/classroom-${classroom.active?.id}/homeworks`">Show all</router-link>
              </q-card-section>
              <q-card-section class="q-pa-none">
                  <HomeworkSlider
                    :classroom-id="classroom.active?.id"
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
                  <router-link :to="`/classroom-${classroom.active?.id}/challenges`" >Show all</router-link>
              </q-card-section>
              <q-card-section class="q-pa-none">
                  <ChallengeSlider
                    :classroom-id="classroom.active?.id"
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
          <q-tab-panel name="leaderboard" class="q-px-none" >
            <q-card flat>
              <q-card-section class="q-pa-none">
                  <LeaderboardTable
                    :allowed-filters="['time_period']"
                    :classroom-id="classroom.active?.id"
                  />
              </q-card-section>
              <q-card-section class="q-pa-none">
                  <LeaderboardChart
                    :allowed-filters="['time_period']"
                    :classroom-id="classroom.active?.id"
                  />
              </q-card-section>
            </q-card>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
      <q-card-section v-else-if="classroom.active?.is_private">
        <q-card flat class="text-center q-pa-md">
          <q-icon name="lock" size="lg"></q-icon>
          <q-card-section class="q-pb-none">
              <div class="text-h6">Content is unavailable</div>
          </q-card-section>
          <q-card-section class="q-py-none">
              This is a private class. Subscribe to see the content
          </q-card-section>
        </q-card>
      </q-card-section>
    </q-card>
    <q-card v-else flat class="full-width transparent">
      <q-card-section class="text-white" >
        <div class="text-subtitle"><b>Choose classroom.active?</b></div>
        <div class="text-caption">And start your investigation</div>
        <q-btn color="dark" @click="dialog = true">Choose</q-btn>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import ClassroomToggle from '../components/ClassroomToggle.vue'
import HomeworkSlider from '../components/HomeworkSlider.vue'
import ChallengeSlider from '../components/ChallengeSlider.vue'
import LeaderboardTable from '../components/LeaderboardTable.vue'
import LeaderboardChart from '../components/LeaderboardChart.vue'
import { useClassroom } from '../composables/useClassroom'
import { useRoute } from 'vue-router'

const route = useRoute()

const dialog = ref(false)
const tab = ref('main')

const backgroundImageHeight = 200
const { classroom, getItem } = useClassroom()

onMounted(() => {
  getItem(route.params.classroom_id)
})
watch(() => route.params.classroom_id, (newData, oldData) => {
  getItem(route.params.classroom_id)
})
</script>
