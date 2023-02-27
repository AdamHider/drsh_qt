<template>
    <q-page-wrapper>
        <q-app-header class="transparent text-white rounded-b-md" reveal>
        <UserToggle/>
        <q-toolbar-title></q-toolbar-title>
        <q-btn flat round dense class="q-mr-sm" icon="share"/>
        </q-app-header>
        <q-page class="flex justify-center content-end  text-center full-width" style="padding-top: 50px">
          <q-card class="transparent no-shadow full-width" style="margin-bottom: -60px; position: relative; z-index: 1;">
              <q-card-section>
                  <q-img
                      src="http://mektepium-app.local/image/robot_fly1.png"
                      style="max-width: 250px; width: 170px;"
                      no-spinner
                  />
              </q-card-section>
          </q-card>
            <q-card flat class="relative text-left q-pt-md q-pb-md rounded-borders rounded-b-0 full-width" style="padding-top: 60px;">
                <q-card-section class="q-pa-none">
                    <LeaderboardTable
                        :allowed-filters="['time_period', 'by_classroom']"
                    />
                </q-card-section>
                <q-card-section class="q-pa-none">
                    <LeaderboardChart
                        :allowed-filters="['time_period', 'by_classroom']"
                    />
                </q-card-section>
            </q-card>
        </q-page>
        <template v-slot:bottom-bar>
          <q-footer  bordered class="bg-white text-primary">
            <q-bottom-bar/>
          </q-footer>
        </template>
    </q-page-wrapper>
</template>

<script setup >
import UserToggle from '../components/UserToggle.vue'
import LeaderboardTable from '../components/LeaderboardTable.vue'
import LeaderboardChart from '../components/LeaderboardChart.vue'
</script>
