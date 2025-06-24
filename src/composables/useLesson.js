import { reactive, ref } from 'vue'
import { api } from '../services/index'

const lesson = reactive({
  active: {},
  list: [],
  dailyList: [],
  target: 0
})

export function useLesson () {
  async function getItem (lessonId) {
    const lessonResponse = await api.lesson.getItem({ lesson_id: lessonId })
    lesson.active = lessonResponse
  }
  async function getList () {
    try {
      const lessonListResponse = await api.lesson.getList({})
      lesson.list = lessonListResponse
    } catch (e) {
      throw new Error('Courses are null: ' + e)
    }
  }
  async function getSatelliteList () {
    const lessonResponse = await api.lesson.getSatellites({ lesson_id: lesson.active.id })
    if(lessonResponse.error){
      lesson.active.satellites = []
    } else {
      lesson.active.satellites = lessonResponse
    }
    lesson.active.satellites.push(lesson.active)
  }
  async function getDailyList () {
    const dailyLessonResponse = await api.lesson.getDailyList({ lesson_id: lesson.active.id })
    lesson.dailyList = dailyLessonResponse
    return dailyLessonResponse
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
  function setTarget (lessonId) {
    lesson.target = lessonId
  }
  function getTarget () {
    return lesson.target
  }

  return {
    getItem,
    getList,
    getSatelliteList,
    getDailyList,
    getPage,
    saveAnswer,
    setTarget,
    getTarget,
    lesson
  }
}
