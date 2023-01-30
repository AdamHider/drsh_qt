import { reactive } from 'vue'
import { api } from '../services/index'
const achievement = reactive({
  list: [],
  limit: 8,
  offset: 0
})

export function useAchievement () {
  async function getList (index) {
    if (achievement.list.length > 0) achievement.offset = achievement.limit * index
    const achievementListResponse = await api.achievements.getList({ mode: 'all', limit: achievement.limit, offset: achievement.offset })
    achievement.list = achievement.list.concat(achievementListResponse)
    return achievementListResponse.length == 0
  }
  async function getListByUser () {
    const achievementListResponse = await api.achievements.getList({ mode: 'user', limit: 5, offset: 0 })
    return achievementListResponse
  }

  return {
    getList,
    getListByUser,
    achievement
  }
}
