<template>
  <q-page-wrapper>
    <q-app-header class="transparent text-white rounded-b-md" reveal>
      <q-btn flat icon="arrow_back" @click="$router.go(-1);" v:slot="back-button"/>
      <q-toolbar-title></q-toolbar-title>
      <q-btn flat round dense class="q-mr-sm" icon="share"/>
      <q-btn flat round dense class="q-mr-sm"  icon="more_vert" @click="preferencesDialog = true"/>
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
              {{ classroom.active?.title }}
            </div>
          </div>
          <div v-if="classroom.active?.description" class="text-grey">
            {{ classroom.active?.description }}
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

        <q-card-section class="q-py-none">
          <div class="q-mb-md q-mx-sm row text-center">
              <div class="col">
                  <div class="text-h5"><b>{{classroom.active?.dashboard?.total_subscribers}}</b></div>
                  <div class="text-caption text-grey">Students</div>
                  <q-tooltip activator="parent" location="top">
                      Total students
                  </q-tooltip>
              </div>
              <q-separator vertical/>
              <div class="col">
                  <div class="text-h5"><b>{{classroom.active?.dashboard?.total_homeworks}}</b></div>
                  <div class="text-caption text-grey">Homeworks</div>
                  <q-tooltip activator="parent" location="top">
                      Total task assigned
                  </q-tooltip>
              </div>
              <q-separator vertical/>
              <div class="col">
                  <div class="text-h5"><b>{{classroom.active?.dashboard?.total_quests}}</b></div>
                  <div class="text-caption text-grey">Challenges</div>
                  <q-tooltip activator="parent" location="top">
                      Total challenges of the classroom
                  </q-tooltip>
              </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div v-if="!classroom.active?.is_owner">
            <q-btn v-if="!classroom.active?.is_subscribed && !classroom.active?.is_disabled_subscriber" push class="full-width" label="Subscribe" color="primary" icon="person_add" @click="subscribeClassroom(classroom.active.code)"></q-btn>
            <q-btn v-else-if="classroom.active?.is_disabled_subscriber" push class="full-width" label="Request sent" icon="person_add" @click="unsubscribeClassroom(classroom.active.code)"></q-btn>
            <q-btn v-else push flat class="full-width" icon="check" label="Subscribed" @click="unsubscribeClassroom(classroom.active.code, classroom.active.is_private)"></q-btn>
          </div>
          <div v-else>
            <q-btn push class="full-width" icon="edit" label="Edit" :to="`/classroom-${classroom.active?.id}/edit`"></q-btn>
          </div>
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
          <q-tab-panels v-model="tab" animated keep-alive >
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
                    <div class="text-h6">Quests</div>
                    <router-link :to="`/classroom-${classroom.active?.id}/quests`" >Show all</router-link>
                </q-card-section>
                <q-card-section class="q-pa-none">
                    <QuestSlider
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
          <q-btn color="dark" @click="classroomListDialog = true">Choose</q-btn>
        </q-card-section>
      </q-card>
    </q-page>
      <q-dialog v-model="preferencesDialog" position="bottom">
        <q-card>
          <q-card-section class="q-px-none">
            <q-list  separator>
              <q-item clickable v-ripple v-if="classroom.active.is_owner" :to="`/classroom-${classroom.active?.id}/edit`">
                <q-item-section >Edit classroom</q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section>Invite friend</q-item-section>
              </q-item>
              <q-item clickable v-if="classroom.active.is_subscribed && !classroom.active.is_disabled_subscriber" v-ripple :to="`/classroom-${classroom.active?.id}/subscribers`">
                <q-item-section>Subscribers</q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </q-dialog>

  </q-page-wrapper>
</template>

<script setup>
import { ref, watch, onMounted, onActivated } from 'vue'
import ClassroomToggle from '../components/ClassroomToggle.vue'
import HomeworkSlider from '../components/HomeworkSlider.vue'
import QuestSlider from '../components/QuestSlider.vue'
import LeaderboardTable from '../components/LeaderboardTable.vue'
import LeaderboardChart from '../components/LeaderboardChart.vue'
import { useClassroom } from '../composables/useClassroom'
import { useUserStore } from '../stores/user'
import { useRoute } from 'vue-router'

const { user } = useUserStore()
const route = useRoute()

const classroomListDialog = ref(false)
const preferencesDialog = ref(false)
const tab = ref('main')

const backgroundImageHeight = 200
const { classroom, getItem, subscribe, unsubscribe } = useClassroom()
const subscribeClassroom = async function () {
  await subscribe({ classroom_code: classroom.active.code })
  getItem(route.params.classroom_id)
}
const unsubscribeClassroom = async function () {
  await unsubscribe({ classroom_code: classroom.active.code })
  getItem(route.params.classroom_id)
}
onMounted(async () => {
  await getItem(route.params.classroom_id)
})
onActivated(async () => {
  await getItem(route.params.classroom_id)
})
watch(() => user.active?.data.settings.classroom_id, (newData, oldData) => {
  getItem(route.params.classroom_id)
})
</script>
