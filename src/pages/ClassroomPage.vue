<template>
  <q-page-wrapper>
    <q-app-header class="transparent text-white rounded-b-md" reveal>
      <q-btn flat icon="arrow_back" @click="$router.go(-1);" v:slot="back-button"/>
      <q-toolbar-title></q-toolbar-title>
      <q-btn flat round dense class="q-mr-sm" icon="share"/>
      <q-btn flat round dense class="q-mr-sm"  icon="more_vert" @click="preferencesDialog = true"/>
    </q-app-header>
    <q-page :class="(classroom?.id) ? 'bg-white' : 'row items-end full-height full-width text-center'"
        :style="(classroom?.id) ? `padding-top: ${backgroundImageHeight}px;` : ''">
      <q-img
        v-if="classroom?.background_image"
        :src="classroom?.background_image"
        :style="`max-height: ${backgroundImageHeight}px; position: fixed; top: 0;`"
      />
      <q-card v-if="classroom?.id" flat style="margin-top: -15px;">
        <q-card-section>
          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">
              {{ classroom?.title }}
            </div>
          </div>
          <div v-if="classroom?.description" class="text-grey">
            {{ classroom?.description }}
          </div>
          <div v-if="classroom?.address" class="text-caption text-grey">
            <q-icon name="location_on" size="sm"></q-icon>
            {{ classroom?.address }}
          </div>
          <div v-if="classroom?.institution" class="text-caption text-grey">
            <q-icon name="location_city" size="sm"></q-icon>
            {{ classroom?.institution }}
          </div>
        </q-card-section>

        <q-card-section class="q-py-none">
          <div class="q-mb-md q-mx-sm row text-center">
              <div class="col">
                  <div class="text-h5"><b>{{classroom?.dashboard?.total_subscribers}}</b></div>
                  <div class="text-caption text-grey">Students</div>
                  <q-tooltip activator="parent" location="top">
                      Total students
                  </q-tooltip>
              </div>
              <q-separator vertical/>
              <div class="col">
                  <div class="text-h5"><b>{{classroom?.dashboard?.total_quests}}</b></div>
                  <div class="text-caption text-grey">Quests</div>
                  <q-tooltip activator="parent" location="top">
                      Total quests assigned
                  </q-tooltip>
              </div>
              <q-separator vertical/>
              <div class="col">
                  <div class="text-h5"><b>{{classroom?.dashboard?.total_rank}}</b></div>
                  <div class="text-caption text-grey">Rank</div>
                  <q-tooltip activator="parent" location="top">
                      The summary of participants' experience
                  </q-tooltip>
              </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div v-if="!classroom?.is_owner">
            <q-btn v-if="!classroom?.is_subscribed && !classroom?.is_disabled_subscriber" push class="full-width" label="Subscribe" color="primary" icon="person_add" @click="subscribeClassroom(classroom.code)"></q-btn>
            <q-btn v-else-if="classroom?.is_disabled_subscriber" flat color="green-8" class="full-width" label="Request sent" icon="person_add" @click="unsubscribeClassroom(classroom.code)"></q-btn>
            <q-btn v-else push flat color="positive" class="full-width" icon="check" label="Subscribed" @click="unsubscribeClassroom(classroom.code, classroom.is_private)"></q-btn>
          </div>
          <div v-else>
            <q-btn push class="full-width" icon="edit" label="Edit" :to="`/classroom-${classroom?.id}/edit`"></q-btn>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section v-if="classroom?.is_subscribed" class="q-pa-none">
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
                    <div class="text-h6">Quests</div>
                    <q-btn
                      v-if="classroom?.is_owner"
                      flat
                      color="primary"
                      icon="add"
                      @click="createQuest()"
                      label="New quest"
                    />
                </q-card-section>
                <q-card-section class="q-pa-none">
                  <QuestList :classroom-id="route.params.classroom_id" :active-only="true"/>
                </q-card-section>
              </q-card>
            </q-tab-panel>
            <q-tab-panel name="leaderboard" class="q-px-none" >
              <q-card flat>
                <q-card-section class="q-pa-none">
                    <LeaderboardTable
                      :allowed-filters="['time_period']"
                      :classroom-id="classroom?.id"
                    />
                </q-card-section>
                <q-card-section class="q-pa-none">
                    <LeaderboardChart
                      :allowed-filters="['time_period']"
                      :classroom-id="classroom?.id"
                    />
                </q-card-section>
              </q-card>
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
        <q-card-section v-else-if="classroom?.is_private">
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
          <div class="text-subtitle"><b>Choose classroom?</b></div>
          <div class="text-caption">And start your investigation</div>
          <q-btn color="dark" @click="classroomListDialog = true">Choose</q-btn>
        </q-card-section>
      </q-card>
    </q-page>
      <q-dialog v-model="preferencesDialog" position="bottom">
        <q-card>
          <q-card-section class="q-px-none">
            <q-list  separator>
              <q-item clickable v-ripple v-if="classroom.is_owner" :to="`/classroom-${classroom?.id}/edit`">
                <q-item-section >Edit classroom</q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section>Invite friend</q-item-section>
              </q-item>
              <q-item clickable v-if="classroom.is_subscribed && !classroom.is_disabled_subscriber" v-ripple :to="`/classroom-${classroom?.id}/subscribers`">
                <q-item-section>Subscribers</q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </q-dialog>

  </q-page-wrapper>
</template>

<script setup>
import { api } from '../services/index'
import { ref, watch, onMounted, onActivated } from 'vue'
import QuestList from '../components/QuestList.vue'
import LeaderboardTable from '../components/LeaderboardTable.vue'
import LeaderboardChart from '../components/LeaderboardChart.vue'
import { useUserStore } from '../stores/user'
import { useRoute, useRouter } from 'vue-router'

const { user } = useUserStore()
const route = useRoute()
const router = useRouter()

const classroomListDialog = ref(false)
const preferencesDialog = ref(false)
const tab = ref('main')
const classroom = ref({})

const backgroundImageHeight = 200

const load = async function () {
  const classroomResponse = await api.classroom.getItem({ classroom_id: route.params.classroom_id })
  if (classroomResponse.error) {
    classroom.value = {}
    return
  }
  classroom.value = classroomResponse
}
const subscribeClassroom = async function () {
  await api.classroom.subscribe({ classroom_code: classroom.value.active.code })
  load()
}
const unsubscribeClassroom = async function () {
  await api.classroom.unsubscribe({ classroom_code: classroom.value.active.code })
  load()
}

const createQuest = async function () {
  const createItemResponse = await api.quest.createItem({ classroom_id: route.params.classroom_id })
  if (!createItemResponse.error) {
    return router.push(`/quest-${createItemResponse}/edit`)
  }
}
onActivated(() => {
  load()
})
watch(() => user.active?.data.settings.classroom_id, (newData, oldData) => {
  load()
})
</script>
