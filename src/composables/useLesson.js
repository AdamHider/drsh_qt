import { reactive, ref } from 'vue'
import { api } from '../services/index'

const lesson = reactive({
  active: {},
  list: [],
  listExtended: {},
  dailyList: [],
  target: 0
})

export function useLesson () {
  async function getItem (lessonId) {
    const lessonResponse = await api.lesson.getItem({ lesson_id: lessonId })
    let satellites = [];
    if(lesson.active.satellites){
      satellites = lesson.active.satellites
    }
    lesson.active = lessonResponse
    lesson.active.satellites = satellites
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
  async function saveAnswer (answers, time) {
    const exerciseAnswerResponse = await api.exercise.saveAnswer({ lesson_id: lesson.active.id, data: answers, time })
    lesson.active.page = exerciseAnswerResponse
    return exerciseAnswerResponse
  }
  async function linkTrainingItem () {
    const linkTrainingItemResponse = await api.training.linkItem({ lesson_id: lesson.active.id, page_index: lesson.active.page.current })
    return linkTrainingItemResponse
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
    linkTrainingItem,
    setTarget,
    getTarget,
    lesson
  }
}
