<template>
    <div>
        <q-list>
            <q-item v-for="(commonItem, commonKey) in leaderboard.common?.list" :key="commonKey" class="q-my-sm q-px-none" >
                <q-item-section avatar>
                    <q-avatar rounded  color="primary" text-color="white" size="50px">
                        <q-icon name="star" color="blue-6" size="50px" class="absolute-top"/>
                        <b style="z-index: 1">{{ commonItem.points }}</b>
                    </q-avatar>
                </q-item-section>
                <q-item-section>
                    <q-item-label><b>{{ commonItem.place }} place</b></q-item-label>
                    <q-item-label caption lines="1">{{ commonItem.usernames }}</q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-icon name="chat_bubble" color="green" />
                </q-item-section>
            </q-item>
        </q-list>
        <Line
          v-if="leaderboard.chart.datasets"
          id="my-chart-id"
          :options="chartOptions"
          :data="leaderboard.chart"
        />
    </div>
</template>

<script setup>
import { reactive, onActivated } from 'vue'
import { useExercise } from '../composables/useExercise.js'
import { useUserStore } from '../stores/user'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'

const { user } = useUserStore()
const { getLeaderboard } = useExercise()

const leaderboard = reactive({
  common: {},
  chart: {}
})

onActivated(async () => {
  const leaderboardResponse = await getLeaderboard({ classroom_id: user.active.data.profile.classroom_id, time_period: 'month' })
  leaderboard.common = leaderboardResponse.common_statistics
  leaderboard.chart = {
    labels: leaderboardResponse.chart_statistics.dates.labels,
    datasets: leaderboardResponse.chart_statistics.users
  }
  ChartJS.register(Title, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale)
})
const chartOptions = {
  responsive: true,
  scaleStartValue: 0,
  animation: {
    easing: 'easeInOutQuad',
    duration: 520
  },
  plugins: {
    legend: {
      display: false,
      labels: {
        usePointStyle: true,
        fillStyle: 'rgb(255, 99, 132)',
        boxWidth: 40,
        family: 'Blogger Sans'
      }
    },
    tooltip: {
      enabled: true,
      position: 'nearest'
    }
  },
  elements: {
    line: {
      borderWidth: 2,
      backgroundColor: 'green'
    }
  },
  scales: {
    x: {
      display: true,
      grid: {
        color: '#e3e3e3',
        lineWidth: 1,
        display: false
      },
      ticks: {
        font: {
          size: 13,
          family: 'Blogger Sans'
        }
      }
    },
    y: {
      beginAtZero: true,
      display: true,
      grid: {
        color: '#e3e3e3',
        lineWidth: 1,
        drawBorder: false
      },
      ticks: {
        padding: 10,
        precision: 0,
        font: {
          size: 13,
          family: 'Blogger Sans'
        },
        count: 5
      }
    }
  },
  layout: {
  },
  animations: {
    y: {
      easing: 'easeOutQuart',
      to: (ctx) => {
        if (ctx.type === 'data') {
          if (ctx.mode === 'default' && ctx.dropped) {
            ctx.dropped = false
            return 1
          }
        }
      }
    }
  }
}
if (window.innerWidth < 768) {
  chartOptions.scales.x.display = false
}

</script>
