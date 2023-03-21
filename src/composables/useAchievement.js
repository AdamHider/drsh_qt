import { reactive } from 'vue'
import { api } from '../services/index'
const achievement = reactive({
  list: [],
  limit: 8,
  offset: 0
})

export function useAchievement () {
  async function getList (filter) {
    const achievementListResponse = await api.achievement.getList(filter)
    if (!achievementListResponse.error) {
      if (filter.offset > 0) {
        achievement.list = achievement.list.concat(achievementListResponse)
      } else {
        achievement.list = achievementListResponse
      }
    }
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
