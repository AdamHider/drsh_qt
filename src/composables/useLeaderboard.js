import { reactive } from 'vue'
import { api } from '../services/index'

const leaderboard = reactive({
  filter: {},
  table: {},
  chart: {}
})

export function useLeaderboard () {
  async function getLeaderboard (mode, filter_strict) {
    let filter = {}

    console.log(filter_strict)
    if (filter_strict) {
      filter = { ...leaderboard.filter, ...filter_strict }
    } else {
      filter = leaderboard.filter
    }
    const leaderboardResponse = await api.exercise.getLeaderboard({ ...{ mode }, ...filter })
    if (!leaderboardResponse.errors) {
      leaderboard[mode] = leaderboardResponse
    }
  }
  return {
    getLeaderboard,
    leaderboard
  }
}
