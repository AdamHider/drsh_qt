import { reactive } from 'vue'
const loader = reactive({
  status: true
})

export function useLoader () {
  function showLoader () {
    loader.status = true
  }
  function hideLoader () {
    if(loader.status == false) return
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
