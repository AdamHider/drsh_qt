import { reactive } from 'vue'
import { api } from '../services/index.js'

const classroom = reactive({
  active: {},
  list: [],
  limit: 2,
  offset: 0,
  chunkIndex: 0,
  subscriber: {
    list: [],
    limit: 10,
    offset: 0,
    chunkIndex: 0
  }
})

export function useClassroom () {
  async function subscribe (params) {
    return api.classroom.subscribe(params)
  }
  async function unsubscribe (params) {
    return api.classroom.unsubscribe(params)
  }
  async function getItem (classroomId) {
    const classroomResponse = await api.classroom.getItem({ classroom_id: classroomId })
    if (!classroomResponse.error) {
      classroom.active = classroomResponse
    }
    return classroomResponse
  }
  async function getList (filter) {
    if (filter.page <= classroom.chunkIndex) return false
    classroom.chunkIndex = filter.page
    classroom.offset = classroom.limit * (classroom.chunkIndex - 1)
    const classroomListResponse = await api.classroom.getList({ ...filter, ...{ limit: classroom.limit, offset: classroom.offset } })
    if (!classroomListResponse.error) {
      classroom.list = classroom.list.concat(classroomListResponse)
      return classroomListResponse.length === 0
    }
    return true
  }
  async function getListUpdates (filter) {
    const classroomListResponse = await api.classroom.getList({ ...filter, ...{ limit: classroom.list.length, offset: 0 } })
    if (!classroomListResponse.error) {
      classroom.list = classroomListResponse
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

  async function getSubscriberList (filter) {
    if (filter.page <= classroom.subscriber.chunkIndex) return false
    classroom.subscriber.chunkIndex = filter.page
    classroom.subscriber.offset = classroom.subscriber.limit * (classroom.subscriber.chunkIndex - 1)
    const subscriberListResponse = await api.classroom.getSubscriberList({ ...filter, ...{ limit: classroom.subscriber.limit, offset: classroom.subscriber.offset } })
    if (!subscriberListResponse.error) {
      classroom.subscriber.list = classroom.subscriber.list.concat(subscriberListResponse)
      return subscriberListResponse.length === 0
    }
    return true
  }
  async function getSubscriberListUpdates (filter) {
    const subscriberListResponse = await api.classroom.getSubscriberList({ ...filter, ...{ limit: classroom.subscriber.list.length, offset: 0 } })
    if (!subscriberListResponse.error) {
      classroom.subscriber.list = subscriberListResponse
    }
  }
  function resetList () {
    classroom.chunkIndex = 0
    classroom.list = []
  }

  return {
    getItem,
    getList,
    getListUpdates,
    createItem,
    saveItem,
    checkIfExists,
    classroom,
    subscribe,
    unsubscribe,
    getSubscriberList,
    getSubscriberListUpdates,
    resetList
  }
}
