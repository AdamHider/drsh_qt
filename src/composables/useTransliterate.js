import { reactive } from 'vue'
import { transliterate } from '../utils/transliterator.js'
import { useUserStore } from '../stores/user'

const { user } = useUserStore()

export function useTransliterate () {
  function transliterateHTML (text) {
    if(user.active?.data.settings.writingMode.value == 'cyr'){
      return transliterate(text, 'cyrillize')
    }
    if(user.active?.data.settings.writingMode.value == 'lat'){
      return transliterate(text, 'latinize')
    }
  }
  return {
    transliterateHTML
  }
}
