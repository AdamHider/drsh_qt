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
    if (!classroomResponse.error) {
      classroom.active = classroomResponse
    }
    return classroomResponse
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
  async function saveItem (data) {
    const classroomSaveResponse = await api.classroom.saveItem(data)
    if (!classroomSaveResponse.error) {
      const classroomResponse = await api.classroom.getItem({ classroom_id: data.id })
      classroom.active = classroomResponse
    }
    return classroomSaveResponse
  }
  async function createItem () {
    const classroomCreateResponse = await api.classroom.createItem()
    if (!classroomCreateResponse.error) {
      return classroomCreateResponse
    }
    return 0
  }

  return {
    getItem,
    getList,
    createItem,
    saveItem,
    checkIfExists,
    classroom,
    subscribe
  }
}
