import { reactive } from 'vue'
const loader = reactive({
  status: true
})

export function useLoader () {
  function showLoader () {
    loader.status = true
  }
  function hideLoader () {
    console.log('hideLoader')
    setTimeout(()=>{
      loader.status = false
    }, 500)

  }

  return {
    showLoader,
    hideLoader,
    loader
  }
}
