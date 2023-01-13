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
    const lessonResponse = await api.lesson.getItem({ id: lessonId })
    lesson.active = lessonResponse.data
  }
  async function getList (index) {
    lesson.offset = lesson.limit * (index - 1)
    try {
      const lessonListResponse = await api.lesson.getList({ limit: lesson.limit, offset: lesson.offset })
      if (lesson.offset > 0) {
        lesson.list = lessonListResponse.data.reverse().concat(lesson.list)
      } else {
        lesson.list = lessonListResponse.data.reverse()
      }
      return lessonListResponse.data.length === 0
    } catch (e) {
      console.log(e)
      throw new Error('Courses are null: ' + e)
    }
  }
  async function getSatteliteList () {
    const lessonResponse = await api.lesson.getSatellites({ lesson_id: lesson.active.id })
    lesson.active.sattelites = lessonResponse.data
  }
  async function getPage (action) {
    const lessonPageResponse = await api.lesson.getPage({ lesson_id: lesson.active.id, action })
    lesson.active.page = lessonPageResponse.data
    return lessonPageResponse.data
  }
  async function saveAnswer (answers) {
    const lessonAnswerResponse = await api.lesson.saveAnswer({ filter: { lesson_id: lesson.active.id }, answers })
    lesson.active.page = lessonAnswerResponse.data
    return lessonAnswerResponse.data
  }

  return {
    getItem,
    getList,
    getSatteliteList,
    getPage,
    saveAnswer,
    lesson
  }
}
