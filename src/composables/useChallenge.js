import { reactive } from 'vue'
import { api } from '../services/index'
const challenge = reactive({
  active: {},
  list: [],
  limit: 8,
  offset: 0
})

export function useChallenge () {
  async function getList (index) {
    if (challenge.list.length > 0) challenge.offset = challenge.limit * index
    const challengeListResponse = await api.challenges.getList({ mode: 'all', limit: challenge.limit, offset: challenge.offset })
    challenge.list = challenge.list.concat(challengeListResponse)
    return challengeListResponse.length == 0
  }
  async function getListByUser () {
    const challengeListResponse = await api.challenges.getList({ mode: 'user', limit: 5, offset: 0 })
    return challengeListResponse
  }

  return {
    getList,
    getListByUser,
    challenge
  }
}
