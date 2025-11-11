import { reactive } from 'vue'
import { api } from '../services'

const routes = reactive({
  course: {
    link: '/courses',
    is_updated: false,
    label: 'Галактика',
    hash: ''
  },
  explore: {
    link: '/explore',
    is_updated: false,
    label: 'Открытия',
    hash: ''
  },
  skills: {
    link: '/skills',
    is_updated: false,
    label: 'Технологии',
    hash: ''
  },
  leaderboard: {
    link: '/leaderboard',
    is_updated: false,
    label: 'Рейтинг',
    hash: ''
  },
  notifications: {
    link: '/notifications',
    is_updated: false,
    label: 'Уведомления',
    hash: ''
  },
  user: {
    link: '/user',
    is_updated: false,
    label: 'Профиль',
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
