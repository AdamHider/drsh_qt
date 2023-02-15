<template>
  <div class="q-px-md">
    <LeaderboardFilter
      v-if="props.filterEnabled"
      :filterClassroomEnabled="props.filterClassroomEnabled"
      :filterDateEnabled="props.filterDateEnabled"
    />
    <div v-if="leaderboard.chart.data?.length > 0" class="relative-position">
        <q-inner-loading :showing="isLoading"/>
        <apexchart
          v-if="leaderboard.chart.options"
          id="vuechart-example"
          type="line"
          :options="leaderboard.chart.options"
          :series="leaderboard.chart.data"
        ></apexchart>
    </div>
  </div>
</template>

<script setup>
import { onActivated, watch, ref } from 'vue'
import LeaderboardFilter from '../components/LeaderboardFilter.vue'
import { useLeaderboard } from '../composables/useLeaderboard.js'

const { leaderboard, getLeaderboard } = useLeaderboard()

const isLoading = ref(false)

const props = defineProps({
  filterStatus: Boolean,
  filterClassroomEnabled: Boolean,
  filterClassroomDefault: Boolean,
  filterDateEnabled: Boolean,
  filterDateDefault: String
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
  await getLeaderboard('chart', filter)
  chartOptionsDefault.xaxis.categories = leaderboard.chart.labels
  if (window.innerWidth < 768) {
    chartOptionsDefault.xaxis.labels.show = false
  }
  leaderboard.chart.options = { ...leaderboard.chart.options, ...chartOptionsDefault }
  isLoading.value = false
}

const prepareFilter = () => {
  const filter = {}
  if (props.filterClassroomDefault) filter.by_classroom = props.filterClassroomDefault
  if (props.filterDateDefault) filter.time_period = props.filterDateDefault
  if (Object.keys(filter).length > 0) {
    return filter
  }
  return false
}

onActivated(() => {
  loadChart()
})

watch(leaderboard.filter, async (currentValue, oldValue) => {
  loadChart()
})
</script>
