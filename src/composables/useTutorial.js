import { reactive } from 'vue'
const tutorial = reactive({
  status: false,
  index: 0,
  active: {},
  total: 9,
  tutorialEnd: false
})

export function useTutorial () {
  function setIndex (index) {
    tutorial.index = index
  }
  function setIndexNext (index) {
    if(tutorial.index == tutorial.total){
      tutorial.tutorialEnd = true
    }
    tutorial.index++
  }
  function setStatus (status) {
    tutorial.status = status
  }

  return {
    setIndex,
    setIndexNext,
    setStatus,
    tutorial
  }
}
