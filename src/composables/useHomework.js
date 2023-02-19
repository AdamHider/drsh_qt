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
  async function getItem (homeworkId) {
    const homeworkResponse = await api.homework.getItem({ homework_id: homeworkId })
    if (homeworkResponse.error) {
      return homeworkResponse
    }
    homework.active = homeworkResponse
  }
  async function getList (filter) {
    if (filter.page <= homework.chunkIndex) return false
    homework.chunkIndex = filter.page
    homework.offset = homework.limit * (homework.chunkIndex - 1)
    const homeworkListResponse = await api.homework.getList({ ...filter, ...{ limit: homework.limit, offset: homework.offset } })
    if (!homeworkListResponse.error) {
      homework.list = homework.list.concat(homeworkListResponse)
      return homeworkListResponse.length === 0
    }
    return true
  }
  async function getListUpdates (filter) {
    const homeworkListResponse = await api.homework.getList({ ...filter, ...{ limit: homework.list.length, offset: 0 } })
    if (!homeworkListResponse.error) {
      homework.list = homeworkListResponse
    }
  }

  return {
    getItem,
    getList,
    getListUpdates,
    homework
  }
}
