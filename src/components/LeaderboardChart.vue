<template>
  <q-card flat>
    <q-card-section class="q-py-none flex justify-between items-center">
      <div class="text-h6">Activity</div>
      <q-icon
        v-if="props.allowedFilters.length > 0"
        @click="filterExpanded = !filterExpanded"
        size="sm"
        color="gray"
        :name="(filterExpanded) ? 'filter_alt_off' : 'filter_alt'"
      ></q-icon>
    </q-card-section>
    <q-card-section v-if="filterExpanded" class="q-py-sm">
      <LeaderboardFilter
        :allowed-filters="props.allowedFilters"
        :classroomId="props.classroomId"
        :timePeriod="props.timePeriod"
        @update-filter="updateFilter($event)"
      />
    </q-card-section>
    <q-card-section v-if="leaderboardData.data?.length > 0" class="q-py-sm relative-position">
        <q-inner-loading :showing="isLoading"/>
        <apexchart
          v-if="leaderboardData.options"
          id="vuechart-example"
          type="line"
          :options="leaderboardData.options"
          :series="leaderboardData.data"
        ></apexchart>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { onActivated, onMounted, ref, reactive } from 'vue'
import LeaderboardFilter from '../components/LeaderboardFilter.vue'
import { useExercise } from '../composables/useExercise.js'

const { getLeaderboard } = useExercise()

const leaderboardData = reactive({
  filter: {
    time_period: 'all'
  },
  data: {},
  options: {}
})

const isLoading = ref(false)
const filterExpanded = ref(false)

const props = defineProps({
  allowedFilters: Array,
  classroomId: String,
  lessonId: String,
  challengeId: String,
  timePeriod: String
})

const chartOptionsDefault = {
  chart: {
    id: 'vuechart-example',
    height: 250,
    toolbar: {
      show: false
    }
  },
  stroke: {
    curve: 'smooth'
  },
  xaxis: {
    labels: {
      show: true
    },
    categories: []
  }
}

const loadChart = async () => {
  const filter = prepareFilter()
  isLoading.value = true
  const leaderboardResponse = await getLeaderboard('chart', filter)
  if (!leaderboardResponse.errors) {
    leaderboardData.data = leaderboardResponse.data
    chartOptionsDefault.xaxis.categories = leaderboardResponse.labels
    if (window.innerWidth < 768) {
      chartOptionsDefault.xaxis.labels.show = false
    }
    leaderboardData.options = { ...leaderboardData.options, ...chartOptionsDefault }
  }
  isLoading.value = false
}

const prepareFilter = () => {
  if (props.classroomId) leaderboardData.filter.classroom_id = props.classroomId
  if (props.timePeriod) leaderboardData.filter.time_period = props.timePeriod
  if (props.lessonId) leaderboardData.filter.lesson_id = props.lessonId
  if (props.challengeId) leaderboardData.filter.challenge_id = props.challengeId
  return leaderboardData.filter
}

const updateFilter = (filter) => {
  leaderboardData.filter = filter
  loadChart()
}

onActivated(async () => {
  if (isLoading.value === true) return
  loadChart()
})
onMounted(async () => {
  if (isLoading.value === true) return
  loadChart()
})

</script>
