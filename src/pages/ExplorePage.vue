<template>
  <q-page-container>
    <q-app-header class="transparent  rounded-b-md q-py-xs" reveal>
        <q-toolbar-title><b>Открытия</b></q-toolbar-title>
        <UserResourceBar v-if="user.active?.data.resources" :resource="user.active?.data.resources.energy" dense no-caption size="24px" push
          @click="() => {if(user.active?.data.resources.energy.quantity == 0) router.push('/market')}"/>
    </q-app-header>
    <q-page class="bg-white"  style="padding-top: 50px; padding-bottom: 48px;">
      <q-card flat class="q-main-card relative text-left  q-pb-md rounded-borders rounded-b-0 full-width" style="flex: 1; min-height: 50vh;">
        <q-card-section class="q-pa-none">
          <q-tab-panels v-model="tab" keep-alive>
            <q-tab-panel name="galaxies" class="q-px-none q-pb-xl">
              <div class="q-mb-sm">
                <ExploreLessonFilter @onChange="filter = $event"/>
              </div>
              <ExploreLessonList :filter="filter"/>
            </q-tab-panel>
            <q-tab-panel name="training" class="q-px-none q-pb-xl" >
              <ExploreTrainingWidget/>
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
      </q-card>
      <q-page-sticky position="bottom" :offset="[0, 54]" style="z-index: 1">
        <q-card flat class="bg-dark-transparent-50">
          <q-card-section class="flex justify-center q-pa-sm" >
            <q-btn push
              class="q-mx-xs"
              :color="(tab == 'galaxies') ? 'gradient-primary' : 'white'"
              :text-color="(tab == 'galaxies') ? 'white' : 'dark'" @click="tab = 'galaxies'">
              Созвездия
            </q-btn>
            <q-btn push
              class="q-mx-xs"
              :color="(tab == 'training') ? 'gradient-primary' : 'white'"
              :text-color="(tab == 'training') ? 'white' : 'dark'" @click="tab = 'training'">
              Тренировка
            </q-btn>
          </q-card-section>
        </q-card>
        </q-page-sticky>
    </q-page>
  </q-page-container>
</template>

<script setup >
import { ref, reactive, onActivated } from 'vue'
import { api } from '../services/index'
import { useUserStore } from '../stores/user'
import ExploreLessonList from '../components/ExploreLessonList.vue'
import ExploreLessonFilter from '../components/ExploreLessonFilter.vue'
import ExploreTrainingWidget from '../components/ExploreTrainingWidget.vue'
import UserResourceBar from '../components/UserResourceBar.vue'


const { user } = useUserStore()

const notifications = ref([])
const error = ref({})
const notLoaded = ref(true)
const tab = ref('galaxies')
const filter = ref({})

</script>
