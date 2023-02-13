import { reactive } from 'vue'
import { api } from '../services/index'

const exercise = reactive({
  active: {}
})

export function useExercise () {
  async function addItem (lessonId) {
    const exerciseResponse = await api.exercise.addItem({ lesson_id: lessonId })
    return exerciseResponse
  }
  async function redoItem (lessonId) {
    const exerciseResponse = await api.exercise.redoItem({ lesson_id: lessonId })
    return exerciseResponse
  }
  async function getLeaderboard (data) {
    const exerciseResponse = await api.exercise.getLeaderboard(data)
    return exerciseResponse
  }

  return {
    addItem,
    redoItem,
    getLeaderboard,
    exercise
  }
}
