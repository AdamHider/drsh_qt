import { reactive } from 'vue'
import { api } from '../services/index'
const homework = reactive({
  active: {},
  list: [],
  limit: 3,
  offset: 0,
  chunkIndex: 0
})

export function useHomework () {
  async function getList (index) {
    if (index <= homework.chunkIndex) return false
    homework.chunkIndex = index
    homework.offset = homework.limit * (homework.chunkIndex - 1)
    const homeworkListResponse = await api.homeworks.getList({ limit: homework.limit, offset: homework.offset })
    homework.list = homework.list.concat(homeworkListResponse)
    return homeworkListResponse.length === 0
  }
  async function getListUpdates () {
    const homeworkListResponse = await api.homeworks.getList({ limit: homework.list.length, offset: 0 })
    homework.list = homeworkListResponse
  }

  return {
    getList,
    getListUpdates,
    homework
  }
}
