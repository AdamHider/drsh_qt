import { reactive, ref } from 'vue'
import { api } from '../services/index'

const explore = reactive({
  active: {},
  list: [],
  listExtended: {},
  dailyList: [],
  target: 0
})

export function useExplore () {
  async function getList (data) {
    try {
      const lessonListResponse = await api.explore.getList(data)
      return lessonListResponse
    } catch (e) {
      throw new Error('Courses are null: ' + e)
    }
  }

  return {
    getList,
    explore
  }
}
