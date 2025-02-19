import { api } from '../services/index'

export function useExercise () {
  async function createItem (lessonId) {
    const exerciseResponse = await api.exercise.createItem({ lesson_id: lessonId })
    return exerciseResponse
  }
  async function redoItem (lessonId) {
    const exerciseResponse = await api.exercise.redoItem({ lesson_id: lessonId })
    return exerciseResponse
  }
  async function getLeaderboard (filter) {
    const leaderboardResponse = await api.exercise.getLeaderboard(filter)
    return leaderboardResponse
  }

  return {
    createItem,
    redoItem,
    getLeaderboard
  }
}
