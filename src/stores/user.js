import { defineStore } from 'pinia'
import { api } from '../services/index'
import Storage from '../utils/storage'
import { computed, reactive } from 'vue'
import { useAppMessage } from '../composables/useAppMessage'

const { showMessage } = useAppMessage()

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
      if (data.data && data.data.id) user.list[data.data.id] = data
    }
    userStorage.set(user)
    return true
  }

  async function getAuth (credentials) {
    if (!credentials) { return }
    const authResponse = await api.user.getAuth(credentials)
    if (!authResponse.error) {
      update({ authorization: authResponse })
    }
    return authResponse
  }

  async function signIn (authKey) {
    if (!authKey) { return }
    const result = await api.user.signIn({ auth_key: authKey })
    if (!result.error) {
      const userResponse = await api.user.getItem()
      update({ authorization: authKey, data: userResponse })
      showMessage('You have signed successfully!')
    }
    return result
  }
  async function getItem () {
    const userResponse = await api.user.getItem()
    update({ data: userResponse })
  }

  async function autoSignIn () {
    if (!user.active.authorization) {
      signOut()
      return false
    }
    const userResponse = await api.user.getItem()
    if (user.active.data.id && user.active.data.id != userResponse.id) {
      const result = await signIn(user.active.authorization)
      if (result.error) {
        signOut()
      }
    }
    update({ data: userResponse })
  }

  async function signOut () {
    await api.user.signOut()
    update(null)
    return true
  }

  async function signUp (credentials) {
    const authResponse = await api.user.signUp(credentials)
    if (!authResponse.error) {
      update({ authorization: authResponse })
    }
    return authResponse
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
  async function saveItemSettings (data) {
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

  async function activate (code) {
    await signOut()
    const result = await api.user.activate(code)
    if (!result.error) {
      await signIn(user.active.authorization)
    }
    return result
  }

  function checkUsername (username) {
    return api.user.checkUsername(username)
  }

  function checkEmail (username) {
    return api.user.checkEmail(username)
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
    saveItemSettings,
    savePassword,
    activate,
    checkUsername,
    checkEmail
  }
})
