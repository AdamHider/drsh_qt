import { reactive, watch } from 'vue'

import { useRoute } from 'vue-router'

const routes = reactive({
  home: '/home',
  classroom: '/classroom',
  notifications: '/notifications',
  user: '/user'
})

export function useNavigationHistory () {
  const route = useRoute()
  console.log(route)
  watch(() => route.fullPath, (currentValue, oldValue) => {
    const currentRoot = (currentValue.split('/')[1])
    routes[currentRoot] = currentValue
  })

  return {
    routes
  }
}
