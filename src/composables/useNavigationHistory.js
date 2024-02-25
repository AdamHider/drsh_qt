import { reactive } from 'vue'

const routes = reactive({
  course: '/courses',
  classroom: '/classroom-dashboard',
  skills: '/skills',
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
