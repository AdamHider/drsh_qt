import { defineStore } from 'pinia'
import { api } from '../services/index'
import Storage from '../utils/storage'
import { computed, reactive } from 'vue'
import { useAppMessage } from '../composables/useAppMessage'

const { showMessage } = useAppMessage()

const userDefault = {
  active: {
    authorization: {
      username: '',
      password: ''
    },
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

  async function signIn (auth) {
    if (!auth) { return }
    const result = await api.user.signIn(auth)
    if (!result.error) {
      const userResponse = await api.user.getItem()
      update({ authorization: auth, data: userResponse })
    }
    showMessage('You have signed successfully!')
    return result
  }

  async function autoSignIn () {
    const userResponse = await api.user.getItem()
    if (user.active.data.id && user.active.data.id != userResponse.id) {
      const result = await signIn(user.active.authorization)
      if (result.error) {
        signOut()
      }
    }
    if (userResponse.id != 0) {
      const userAuth = user.active.authorization
      userAuth.username = userResponse.username
      update({ authorization: userAuth, data: userResponse })
    }
  }

  async function signOut () {
    await api.user.signOut()
    update(null)
    return true
  }

  async function signUp (auth) {
    const authResponse = await api.user.signUp(auth)
    if (!authResponse.error) {
      update({ authorization: { username: authResponse.username, password: auth.password } })
    }
    return authResponse
  }
  async function saveItem (data) {
    const userSavedResponse = await api.user.saveItem(data)
    if (!userSavedResponse.error) {
      const userResponse = await api.user.getItem()
      const userAuth = user.active.authorization
      userAuth.username = userResponse.username
      update({ authorization: userAuth, data: userResponse })
    }
    showMessage('User data saved!')
    return userSavedResponse
  }
  async function saveProfile (data) {
    const saveProfileResponse = await api.user.saveProfile(data)
    if (!saveProfileResponse.error) {
      const userResponse = await api.user.getItem()
      update({ data: userResponse })
    }
    showMessage('User profile saved!')
    return saveProfileResponse
  }

  async function savePassword (data) {
    const saveResponse = await api.user.savePassword(data)
    if (!saveResponse.error) {
      const userResponse = await api.user.getItem()
      const userAuth = user.active.authorization
      userAuth.password = data.password
      update({ authorization: userAuth, data: userResponse })
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
    autoSignIn,
    signOut,
    signUp,
    saveItem,
    saveProfile,
    savePassword,
    activate,
    checkUsername,
    checkEmail
  }
})
