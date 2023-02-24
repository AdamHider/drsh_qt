import { reactive } from 'vue'

const routes = reactive({
  course: '/course',
  explore: '/explore',
  classroom: '/classroom',
  leaderboard: '/leaderboard',
  user: '/user'
})

export function useNavigationHistory () {
  function watchRoute (route) {
    const currentRoot = (route.fullPath.split('/')[1])
    routes[currentRoot] = route.fullPath
  }
  return {
    watchRoute,
    routes
  }
}
