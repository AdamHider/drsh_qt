import { reactive } from 'vue'
import { api } from '../services'

const course = reactive({
  active: {},
  list: [],
  isLoading: false
})

export function useCourse () {
  async function getItem (courseId) {
    const courseResponse = await api.course.getItem({ course_id: courseId })
    if (!courseResponse.error) {
      course.active = courseResponse
    }
    return courseResponse
  }
  async function getList () {
    course.isLoading = true
    try {
      const courseResponse = await api.course.getList()
      course.list = courseResponse
    } catch (e) {
      throw new Error('Courses are null: ' + e)
    }
    course.isLoading = false
  }
  return {
    getList,
    getItem,
    course
  }
}
