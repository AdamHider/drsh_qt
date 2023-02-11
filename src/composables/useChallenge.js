import { reactive } from 'vue'
import { api } from '../services/index'
const challenge = reactive({
  active: {},
  list: [],
  limit: 2,
  offset: 0,
  chunkIndex: 0
})

export function useChallenge () {
  async function getList (index, limit) {
    if (limit) challenge.limit = limit
    if (index === 0) challenge.offset = 0
    challenge.chunkIndex = index
    if (challenge.list.length > 0) challenge.offset = challenge.limit * challenge.chunkIndex
    const challengeListResponse = await api.challenges.getList({ limit: challenge.limit, offset: challenge.offset })
    if (challenge.chunkIndex === 0) {
      challenge.list = challengeListResponse
    } else {
      challenge.list = challenge.list.concat(challengeListResponse)
    }

    return challengeListResponse.length === 0
  }

  return {
    getList,
    challenge
  }
}
