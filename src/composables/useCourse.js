import { reactive, watch } from 'vue'
import { api } from '../services'
import { useClassroom } from '../composables/useClassroom'

const course = reactive({
  list: [],
  isLoading: false
})
const { classroom } = useClassroom()

export function useCourse () {
  async function getList () {
    course.isLoading = true
    try {
      const courseResponse = await api.course.getList()
      course.list = courseResponse.data
    } catch (e) {
      console.log(e)
      throw new Error('Courses are null: ' + e)
    }
    course.isLoading = false
  }
  return {
    getList,
    course
  }
}

watch(() => classroom.active?.id, async (newData, oldData) => {
  useCourse().getList()
})
