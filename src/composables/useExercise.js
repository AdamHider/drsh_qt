import { reactive } from 'vue'
import { api } from '../services/index'

const exercise = reactive({
  active: {}
})

export function useExercise () {
  async function addItem (lessonId) {
    const exerciseResponse = await api.exercise.addItem({ lesson_id: lessonId })
    return exerciseResponse.data
  }

  return {
    addItem,
    exercise
  }
}
