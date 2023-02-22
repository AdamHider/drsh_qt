import { reactive } from 'vue'
import { api } from '../services/index'
const achievement = reactive({
  list: [],
  limit: 8,
  offset: 0
})

export function useImage () {
  function uploadImage (file) {
    const data = new FormData()
    data.append('name', 'image')
    data.append('file', file)
    return api.image.upload(file)
  }

  return {
    uploadImage,
    achievement
  }
}
