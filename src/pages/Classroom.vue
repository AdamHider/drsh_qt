<template>
    <q-page class="bg-white" :style="`padding-top: ${backgroundImageHeight - 50 - 15}px`">
      <q-img
        :src="`${CONFIG.API_HOST}${classroom.active?.fulltext_image}`"
        :style="`max-height: ${backgroundImageHeight}px; position: fixed; top: 0;`"
      />
      <q-card flat class="my-card" style="margin-top: -15px;">
        <q-card-section>
          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">
              {{ classroom.active?.title }}
            </div>
            <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
              <q-icon name="place" />
              250 ft
            </div>
          </div>
          <div v-if="classroom.active?.description" class="text-grey">
            {{ classroom.active?.description }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
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
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="main">
            <div class="text-h6">Mails</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>

          <q-tab-panel name="leaderboard">
            <div class="text-h6">Alarms</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>

        </q-tab-panels>

      </q-card>
    </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useClassroom } from '../composables/useClassroom'
import { CONFIG } from '../config.js'
import { useUserStore } from '../stores/user'
const { user } = useUserStore()

const backgroundImageHeight = 200
const tab = ref('main')
const { classroom, getActive } = useClassroom()
getActive()
watch(() => user.active.data?.profile.active_classroom_code, async (newData, oldData) => {
  getActive()
})
</script>
