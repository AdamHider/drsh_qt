import { defineStore } from 'pinia'
import Storage from '../utils/storage'
import { reactive } from 'vue'

const dataDefault = []

const cacheWhiteList = [
  'classroom/getItem',
  'classroom/getList',
  'quest/getItem',
  'quest/getList',
  'user/getItem',
  'achievement/getItem',
  'achievement/getList'
]

export const remoteDataStorage = new Storage('drsh_remote_data_store')

export const useRemoteDataStore = defineStore('drsh_remote_data_store', () => {
  let cachedData = reactive(remoteDataStorage.get() || dataDefault)

  function checkCacheItem (controller, method, filter) {
    const request = {
      controller,
      method,
      filter: JSON.stringify(filter)
    }
    const key = cachedData.findIndex(o => o.req.controller === request.controller && o.req.method === request.method && JSON.stringify(o.req.filter) === JSON.stringify(request.filter))
    return key
  }

  function getCacheItem (controller, method, filter, data) {
    const request = {
      controller,
      method,
      filter
    }
    const key = cachedData.findIndex(o => o.req.controller === request.controller && o.req.method === request.method && JSON.stringify(o.req.filter) === JSON.stringify(request.filter))
    if (key === -1) {
      return false
    }
    return cachedData[key].resp
  }

  function checkWhiteList (controller, method) {
    if (cacheWhiteList.indexOf(controller + '/' + method) === -1) {
      const existingItemIndex = cachedData.findIndex(o => o.req.controller === controller && o.req.method === method)
      if (existingItemIndex > -1) {
        removeCacheItem(controller, method)
      }
      return false
    }
    return true
  }

  function removeCacheItem (controller, method) {
    const newCacheList = []
    for (const i in cachedData) {
      if (cachedData[i].req.controller !== controller && cachedData[i].req.method !== method) {
        newCacheList.push(cachedData[i])
      }
    }
    cachedData = newCacheList
    remoteDataStorage.set(cachedData)
  }

  function saveCacheItem (controller, method, filter, data) {
    if (!checkWhiteList(controller, method)) {
      return false
    }
    const request = {
      controller,
      method,
      filter
    }
    const key = cachedData.findIndex(o => o.req.controller === request.controller && o.req.method === request.method && JSON.stringify(o.req.filter) === JSON.stringify(request.filter))
    if (key === -1) {
      cachedData.push({ req: request, resp: data })
    } else {
      cachedData[key].resp = data
    }
    remoteDataStorage.set(cachedData)
  }

  return {
    cachedData,
    getCacheItem,
    checkCacheItem,
    saveCacheItem
  }
})
