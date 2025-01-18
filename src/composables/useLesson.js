import { reactive } from 'vue'
import { api } from '../services/index'

const lesson = reactive({
  active: {},
  list: [],
  limit: 10,
  offset: 0
})

export function useLesson () {
  async function getItem (lessonId) {
    const lessonResponse = await api.lesson.getItem({ lesson_id: lessonId })
    lesson.active = lessonResponse
  }
  async function getList (index) {
    lesson.offset = lesson.limit * (index - 1)
    try {
      const lessonListResponse = await api.lesson.getList({ limit: lesson.limit, offset: lesson.offset })
      if (lesson.offset > 0) {
        lesson.list = lessonListResponse.reverse().concat(lesson.list)
      } else {
        lesson.list = lessonListResponse.reverse()
      }
      return lessonListResponse.length === 0
    } catch (e) {
      console.log(e)
      throw new Error('Courses are null: ' + e)
    }
  }
  async function getListUpdates () {
    const lessonListResponse = await api.lesson.getList({ limit: lesson.list.length, offset: 0 })
    if (!lessonListResponse.error) {
      lesson.list = lessonListResponse.reverse()
    }
  }
  async function getSatelliteList () {
    const lessonResponse = await api.lesson.getSatellites({ lesson_id: lesson.active.id })
    lesson.active.satellites = lessonResponse
    lesson.active.satellites.list.push(lesson.active)
  }
  async function getPage (action) {
    const lessonPageResponse = await api.lesson.getPage({ lesson_id: lesson.active.id, action })
    lesson.active.page = lessonPageResponse
    return lessonPageResponse
  }
  async function saveAnswer (answers) {
    const exerciseAnswerResponse = await api.exercise.saveAnswer({ lesson_id: lesson.active.id, data: answers })
    lesson.active.page = exerciseAnswerResponse
    return exerciseAnswerResponse
  }

  return {
    getItem,
    getList,
    getListUpdates,
    getSatelliteList,
    getPage,
    saveAnswer,
    lesson
  }
}
