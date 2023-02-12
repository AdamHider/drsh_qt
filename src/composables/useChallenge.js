import { reactive } from 'vue'
import { api } from '../services/index'
const challenge = reactive({
  active: {},
  list: [],
  limit: 3,
  offset: 0,
  chunkIndex: 0
})

export function useChallenge () {
  async function getList (index) {
    if (index <= challenge.chunkIndex) return false
    challenge.chunkIndex = index
    challenge.offset = challenge.limit * (challenge.chunkIndex - 1)
    const challengeListResponse = await api.challenges.getList({ limit: challenge.limit, offset: challenge.offset })
    challenge.list = challenge.list.concat(challengeListResponse)
    return challengeListResponse.length === 0
  }
  async function getListUpdates () {
    const challengeListResponse = await api.challenges.getList({ limit: challenge.list.length, offset: 0 })
    challenge.list = challengeListResponse
  }

  return {
    getList,
    getListUpdates,
    challenge
  }
}
