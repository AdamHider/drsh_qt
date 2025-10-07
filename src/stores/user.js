import { defineStore } from 'pinia'
import { api } from '../services/index'
import Storage from '../utils/storage'
import { computed, reactive } from 'vue'
import { useAppMessage } from '../composables/useAppMessage'
import { useNotification } from '../composables/useNotification'

const { showMessage } = useAppMessage()
const { initSSE, closeSSE } = useNotification()

const userDefault = {
  active: {
    authorization: '',
    data: {}
  },
  list: {}
}

export const userStorage = new Storage('drsh_user_store')

export const useUserStore = defineStore('drsh_user_store', () => {
  const user = reactive(userStorage.get() || userDefault)

  const isAuthorized = computed(() => user.active.data.id !== null)

  function update (data) {
    if (data === undefined || data === null) {
      user.active.authorization = {}
      user.active.data = {}
    } else {
      if (data.authorization) user.active.authorization = data.authorization
      if (data.data) user.active.data = data.data
      if (data.data && data.data.id){
        if(!user.list[data.data.id]) user.list[data.data.id] = {}
        user.list[data.data.id].data = data.data
        if (data.authorization) user.list[data.data.id].authorization = data.authorization
      } 
      
    }
    userStorage.set(user)
    return true
  }
  /* AUTH */
  async function getAuth (credentials) {
    if (!credentials) { return }
    const authResponse = await api.auth.getAuth(credentials)
    if (!authResponse.error) {
      update({ authorization: authResponse })
    }
    return authResponse
  }
  async function signIn (authKey) {
    if (!authKey) { return }
    const result = await api.auth.signIn({ auth_key: authKey })
    if (!result.error) {
      const userResponse = await api.user.getItem()
      update({ authorization: authKey, data: userResponse })
      initSSE()
      showMessage('You have signed successfully!')
    }
    return result
  }
  async function autoSignIn () {
    if (!user.active.authorization) {
      signOut()
      return false
    }
    const userResponse = await api.user.getItem()
    if(userResponse.error) {
      return signOut();
    }
    if (user.active.data.id && user.active.data.id != userResponse.id) {
      const result = await signIn(user.active.authorization)
      if (result.error) {
        signOut()
      }
    }
    update({ data: userResponse })
  }
  async function signOut () {
    await api.auth.signOut()
    update(null)
    closeSSE()
    return true
  }
  async function signUp (credentials) {
    const authResponse = await api.auth.signUp(credentials)
    if (!authResponse.error) {
      update({ authorization: authResponse })
    }
    return authResponse
  }

  /* USER */
  async function getItem () {
    const userResponse = await api.user.getItem()
    if(!userResponse.error){
      update({ data: userResponse })
    }

  }
  async function saveItem (data) {
    const userSavedResponse = await api.user.saveItem(data)
    if (!userSavedResponse.error) {
      const userResponse = await api.user.getItem()
      update({ data: userResponse })
    }
    showMessage('User data saved!')
    return userSavedResponse
  }
  async function saveItemSetting (data) {
    const userSettingsResponse = await api.user.saveItemSettings(data)
    if (!userSettingsResponse.error) {
      const userResponse = await api.user.getItem()
      update({ data: userResponse })
    }
    showMessage('User profile saved!')
    return userSettingsResponse
  }
  async function savePassword (data) {
    const saveResponse = await api.user.savePassword(data)
    if (!saveResponse.error) {
      const userResponse = await api.user.getItem()
      update({ authorization: saveResponse, data: userResponse })
    }
    showMessage('User data saved!')
    return saveResponse
  }
  function checkUsername (params) {
    return api.user.checkUsername(params)
  }
  function checkUsernameAuth (params) {
    return api.user.checkUsernameAuth(params)
  }
  function checkEmail (params) {
    return api.user.checkEmail(params)
  }
  function checkEmailVerification (params) {
    return api.user.checkEmailVerification(params)
  }
  function generateUsername (params) {
    return api.user.generateUsername(params)
  }
  function getItemInvitation (params) {
    return api.user.getItemInvitation(params)
  }
  function claimItemInvitation (params) {
    return api.user.claimItemInvitation(params)
  }



  return {
    user,
    isAuthorized,
    update,
    signIn,
    getItem,
    getAuth,
    autoSignIn,
    signOut,
    signUp,
    saveItem,
    saveItemSetting,
    savePassword,
    checkUsername,
    checkUsernameAuth,
    checkEmail,
    checkEmailVerification,
    generateUsername,
    getItemInvitation,
    claimItemInvitation
  }
})
