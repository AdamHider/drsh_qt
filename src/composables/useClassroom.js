import { reactive } from 'vue'
import { api } from '../services/index.js'

const classroom = reactive({
  active: {},
  list: []
})

export function useClassroom () {
  async function subscribe (params) {
    return api.classroom.subscribe(params)
  }
  async function getItem (classroomId) {
    const classroomResponse = await api.classroom.getItem({ classroom_id: classroomId })
    classroom.active = classroomResponse
  }
  async function getList () {
    try {
      const classroomListResponse = await api.classroom.getList({ mode: 'by_user' })
      classroom.list = classroomListResponse
    } catch (e) {
      throw new Error('classroom are null: ' + e)
    }
  }
  async function checkIfExists (code) {
    try {
      return api.classroom.checkIfExists({ code })
    } catch (e) {
      throw new Error('classroom are null: ' + e)
    }
  }

  return {
    getItem,
    getList,
    checkIfExists,
    classroom,
    subscribe
  }
}
