<template>
  <q-card flat >
    <q-card-section class="q-py-sm text-left">
      <LeaderboardFilter
        :allowed-filters="props.allowedFilters"
        :timePeriod="props.timePeriod"
        @update-filter="updateFilter($event)"
      />
    </q-card-section>
    <q-card-section v-if="leaderboardData.data.length > 0 " class="q-py-sm relative-position">
      <q-inner-loading :showing="isLoading"/>
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
                </span>
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <div class="text-subtitle"><b>{{ row.points }}</b></div>
            </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
    <q-card-section v-else-if="!isLoading" class="q-pa-none">
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

const isLoading = ref(false)

const props = defineProps({
  allowedFilters: Array,
  lessonId: String,
  challengeId: String,
  timePeriod: String
})

const loadTable = async () => {
  const filter = prepareFilter()
  isLoading.value = true
  const leaderboardResponse = await getLeaderboard(filter)
  leaderboardData.data = leaderboardResponse
  isLoading.value = false
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
  if (isLoading.value === true) return
  loadTable()
})
onMounted(async () => {
  if (isLoading.value === true) return
  loadTable()
})
</script>
