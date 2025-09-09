<template>
  <q-card flat style="min-height:300px">
    <q-inner-loading :showing="notLoaded">
      <q-spinner-puff size="50px" color="primary" />
    </q-inner-loading>
    <q-card-section class="q-py-sm text-left">
      <LeaderboardFilter
        :allowed-filters="props.allowedFilters"
        :timePeriod="props.timePeriod"
        @update-filter="updateFilter($event)"
      />
    </q-card-section>
    <q-card-section v-if="leaderboardData.data.length > 0 " class="q-py-sm relative-position">

      <q-list separator >
        <q-item v-for="(row, commonKey) in leaderboardData.data" :key="commonKey" :active="row.is_active == 1" :class="`q-my-sm q-px-none text-left `">
            <q-item-section avatar class="text-center">
              <q-avatar size="40px">
                <b>{{ row.place }}</b>
              </q-avatar>
            </q-item-section>

            <q-item-section avatar>
              <div class="q-gutter-sm">
                <q-avatar size="40px">
                    <img :src="row.image">
                </q-avatar>
              </div>
            </q-item-section>
            <q-item-section>
              <q-item-label>
                <span class="q-pa-none text-dark">
                  <b :class="(row.is_active == 1) ? 'text-primary' : 'text-dark'">{{ row.name }}</b>

                  <span class="q-ml-xs" v-if="row.achievements.length > 0">
                    <q-avatar size="22px" v-for="(achievementItem, achievementIndex) in row.achievements" :key="`achievementIndex${achievementIndex}`">
                      <q-img :src="achievementItem.image"/>
                      <q-tooltip>
                        <q-item class="q-pl-sm">
                          <q-item-section avatar>
                            <q-img :src="achievementItem.image"/>
                          </q-item-section>
                          <q-item-section>
                            <b>{{ achievementItem.title }}</b>
                          </q-item-section>
                        </q-item>
                      </q-tooltip>
                    </q-avatar>
                  </span>
                </span>
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <div class="text-subtitle"><b>{{ row.points }}</b></div>
            </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
    <q-card-section v-else-if="!notLoaded" class="q-pa-none">
      <BannerNotFound
        title="Ooops..."
        description="There is no available statistics"
        default-image
      />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { onActivated, onMounted, ref, reactive, watch } from 'vue'
import LeaderboardFilter from '../components/LeaderboardFilter.vue'
import BannerNotFound from '../components/BannerNotFound.vue'
import { useExercise } from '../composables/useExercise.js'

const { getLeaderboard } = useExercise()

const leaderboardData = reactive({
  filter: {
    time_period: 'all'
  },
  data: {}
})

const notLoaded = ref(true)

const props = defineProps({
  allowedFilters: Array,
  lessonId: String,
  challengeId: String,
  timePeriod: String
})

const loadTable = async () => {
  const filter = prepareFilter()
  const leaderboardResponse = await getLeaderboard(filter)
  leaderboardData.data = leaderboardResponse
  notLoaded.value = false
}

const prepareFilter = () => {
  if (props.lessonId) leaderboardData.filter.lesson_id = props.lessonId
  if (props.timePeriod) leaderboardData.filter.time_period = props.timePeriod
  return leaderboardData.filter
}

const updateFilter = (filter) => {
  leaderboardData.filter = filter
  loadTable()
}

onActivated(async () => {
  if (notLoaded.value === false) return
  loadTable()
})
onMounted(async () => {
  if (notLoaded.value === false) return
  loadTable()
})
</script>
