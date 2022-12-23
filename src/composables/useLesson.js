import { reactive } from 'vue'
import { api } from '../services/index'
const lesson = reactive({
  list: [],
  limit: 10,
  offset: 0
})

export function useLesson () {
  async function getList (index) {
    console.log(index)
    lesson.offset = lesson.limit * (index - 1)
    try {
      const lessonListResponse = await api.lesson.getList({ limit: lesson.limit, offset: lesson.offset })
      lesson.list = lessonListResponse.data.reverse().concat(lesson.list)
      return lessonListResponse.data.length == 0
    } catch (e) {
      console.log(e)
      throw new Error('Courses are null: ' + e)
    }
  }

  return {
    getList,
    lesson
  }
}
