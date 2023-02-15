<template>
  <q-card  flat>
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
        :byClassroom="props.byClassroom"
        :timePeriod="props.timePeriod"
        @update-filter="updateFilter($event)"
      />
    </q-card-section>
    <q-card-section v-if="leaderboardData.data.length > 0" class="q-py-sm relative-position">
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
import { onActivated, ref, reactive } from 'vue'
import LeaderboardFilter from '../components/LeaderboardFilter.vue'
import { useExercise } from '../composables/useExercise.js'

const { getLeaderboard } = useExercise()

const leaderboardData = reactive({
  filter: {
    by_classroom: false,
    time_period: 'week'
  },
  data: {},
  options: {}
})

const isLoading = ref(false)
const filterExpanded = ref(false)

const props = defineProps({
  allowedFilters: Array,
  byClassroom: Boolean,
  timePeriod: String
})

const chartOptionsDefault = {
  chart: {
    id: 'vuechart-example',
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
  leaderboardData.data = leaderboardResponse.data
  chartOptionsDefault.xaxis.categories = leaderboardResponse.labels
  if (window.innerWidth < 768) {
    chartOptionsDefault.xaxis.labels.show = false
  }
  leaderboardData.options = { ...leaderboardData.options, ...chartOptionsDefault }
  console.log(leaderboardData)
  isLoading.value = false
}

const prepareFilter = () => {
  if (props.byClassroom) leaderboardData.filter.by_classroom = props.byClassroom
  if (props.timePeriod) leaderboardData.filter.time_period = props.timePeriod
  return leaderboardData.filter
}

const updateFilter = (filter) => {
  leaderboardData.filter = filter
  loadChart()
}

onActivated(() => {
  loadChart()
})

</script>
