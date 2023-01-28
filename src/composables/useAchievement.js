import { reactive } from 'vue'
import { api } from '../services/index'
const achievement = reactive({
  list: [],
  limit: 8,
  offset: 0
})

export function useAchievement () {
  async function getList (index) {
    achievement.offset = achievement.limit * index
    const achievementListResponse = await api.achievements.getList({ limit: achievement.limit, offset: achievement.offset })
    achievement.list = achievement.list.concat(achievementListResponse.data)
    return achievementListResponse.data.length == 0
  }
  async function getListByUser () {
    const achievementListResponse = await api.achievements.getList()
    return achievementListResponse.data
  }

  return {
    getList,
    getListByUser,
    achievement
  }
}
