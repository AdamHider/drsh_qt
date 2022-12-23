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
    try {
      const achievementListResponse = await api.achievement.getList({ limit: achievement.limit, offset: achievement.offset })
      achievement.list = achievement.list.concat(achievementListResponse.data)
      return achievementListResponse.data.length == 0
    } catch (e) {
      console.log(e)
      throw new Error('Courses are null: ' + e)
    }
  }
  async function getListByUser () {
    try {
      const achievementListResponse = await api.achievement.getList()
      return achievementListResponse.data
    } catch (e) {
      console.log(e)
      throw new Error('Courses are null: ' + e)
    }
  }

  return {
    getList,
    getListByUser,
    achievement
  }
}
