import { reactive } from 'vue'
import { api } from '../services/index'
const homework = reactive({
  active: {},
  list: [],
  limit: 8,
  offset: 0
})

export function useHomework () {
  async function getList (index) {
    if (homework.list.length > 0) homework.offset = homework.limit * index
    const homeworkListResponse = await api.homeworks.getList({ mode: 'all', limit: homework.limit, offset: homework.offset })
    homework.list = homework.list.concat(homeworkListResponse)
    return homeworkListResponse.length == 0
  }
  async function getListByUser () {
    const homeworkListResponse = await api.homeworks.getList({ mode: 'user', limit: 5, offset: 0 })
    return homeworkListResponse
  }

  return {
    getList,
    getListByUser,
    homework
  }
}
