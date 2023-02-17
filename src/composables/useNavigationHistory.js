import { reactive } from 'vue'

import { useRoute } from 'vue-router'

const routes = reactive({
  course: '/course',
  explore: '/explore',
  classroom: '/classroom',
  leaderboard: '/leaderboard',
  user: '/user'
})

export function useNavigationHistory () {
  const route = useRoute()
  /*
  console.log(route.fullPath)
  const currentRoot = (route.fullPath.split('/')[1])
  routes[currentRoot] = route.fullPath */
  return {
    routes
  }
}
