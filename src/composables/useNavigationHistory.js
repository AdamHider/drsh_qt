import { reactive } from 'vue'
import { api } from '../services'

const routes = reactive({
  course: {
    link: '/courses',
    is_updated: false,
    hash: ''
  },
  skills: {
    link: '/skills',
    is_updated: false,
    hash: ''
  },
  leaderboard: {
    link: '/leaderboard',
    is_updated: false,
    hash: ''
  },
  notifications: {
    link: '/notifications',
    is_updated: false,
    hash: ''
  },
  user: {
    link: '/user',
    is_updated: false,
    hash: ''
  }
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
