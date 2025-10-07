import { reactive } from 'vue'
import { api } from '../services'

const quest = reactive({
  activeList: [],
  list: [],
  isLoading: false
})

export function useQuest () {
  async function getList (active_only) {
    const questListResponse = await api.quest.getList({ active_only })
    if (questListResponse.error || questListResponse == 'not_found') {
      quest.list = []
      return false;
    }
    quest.list = questListResponse
    setActiveList()
  }
  function setActiveList () {
    quest.activeList = quest.list.filter((item) => { return item.status == 'active' && !item.is_completed })
  }
  function claimItem (quest_id) {
    return api.quest.claimReward({ quest_id })
  }
  function startItem (quest_id) {
    return api.quest.startItem({ quest_id })
  }

  return {
    getList,
    claimItem,
    startItem,
    quest
  }
}
