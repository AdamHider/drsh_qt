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
  async function getActive () {
    const classroomResponse = await api.classroom.getActive()
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
    getActive,
    getList,
    checkIfExists,
    classroom,
    subscribe
  }
}
