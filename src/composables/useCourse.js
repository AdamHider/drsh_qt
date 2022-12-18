import { reactive, watch } from 'vue'
import { api } from '../services'
import { useUserStore } from '../stores/user'

const course = reactive({
  list: []
})

export function useCourse () {
  async function getList () {
    try {
      const courseResponse = await api.course.getList()
      course.list = courseResponse.data
    } catch (e) {
      console.log(e)
      throw new Error('Courses are null: ' + e)
    }
  }
  const { user } = useUserStore()

  watch(user.active, (newData, oldData) => {
    getList()
  })

  return {
    getList,
    course
  }
}
