import { reactive } from 'vue'
import { api } from '../services/index'
const achievement = reactive({
  list: [],
  limit: 8,
  offset: 0
})

export function useAchievement () {
  async function getList (filter) {
    return await api.achievement.getList(filter)
  }
  async function getListByUser () {
    const achievementListResponse = await api.achievement.getList({ mode: 'user', limit: 5, offset: 0 })
    if (!achievementListResponse.error) {
      return achievementListResponse
    }
    return false
  }

  return {
    getList,
    getListByUser,
    achievement
  }
}
