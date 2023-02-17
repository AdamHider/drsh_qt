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
  async function getItem (challengeId) {
    const challengeResponse = await api.challenge.getItem({ challenge_id: challengeId })
    if (!challengeResponse.error) {
      challenge.active = challengeResponse
    }
  }
  async function getList (index) {
    if (index <= challenge.chunkIndex) return false
    challenge.chunkIndex = index
    challenge.offset = challenge.limit * (challenge.chunkIndex - 1)
    const challengeListResponse = await api.challenge.getList({ limit: challenge.limit, offset: challenge.offset })
    if (!challengeListResponse.error) {
      challenge.list = challenge.list.concat(challengeListResponse)
      return challengeListResponse.length === 0
    }
    return true
  }
  async function getListUpdates () {
    const challengeListResponse = await api.challenge.getList({ limit: challenge.list.length, offset: 0 })
    if (!challengeListResponse.error) {
      challenge.list = challengeListResponse
    }
  }
  async function addWinner (challengeId) {
    const challengeWinnerResponse = await api.challenge.addWinnerItem({ challenge_id: challengeId })
    if (!challengeWinnerResponse.error) {
      return challengeWinnerResponse
    }
    return false
  }

  return {
    getItem,
    getList,
    getListUpdates,
    addWinner,
    challenge
  }
}
