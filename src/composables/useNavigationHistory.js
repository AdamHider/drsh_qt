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
  async function getSkillsDataHash () {
    const hashResponse = await api.skill.getList()
  }
  async function getQuestsDataHash () {
    const questResponse = await api.quest.getList({active_only:	true, limit:	8, offset:	0})
    const dataHash = api.lastRequestDataHash
    if(dataHash !== routes.quests.hash){
      routes.quests.hash = dataHash
      routes.quests.is_updated = true
    }
  }
  return {
    watchRoute,
    getQuestsDataHash,
    getSkillsDataHash,
    routes
  }
}
