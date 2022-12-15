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
  /*
  const currentRoot = (route.fullPath.split('/')[1])
  routes[currentRoot] = route.fullPath
*/
  return {
    routes
  }
}
