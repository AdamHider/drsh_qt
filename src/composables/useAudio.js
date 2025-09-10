import { reactive, watch } from 'vue'
import { api } from '../services/index'
import { CONFIG } from '../config.js'
import { useLesson } from '../composables/useLesson'

const { lesson } = useLesson()

const lessonAudio = reactive({
  list: [],
  activeIndex: 0,
  is_playing: false,
  breakBetween: 500,
  intervalLength: 10
})

export function useAudio () {


  function pauseAudio () {
    lessonAudio.list[lessonAudio.activeIndex].element.pause()
    lessonAudio.is_playing = false
    clearInterval(lessonAudio.interval)
    lessonAudio.interval = false
  }
  function stopAudio (excludeIndex) {
    pauseAudio()
    lessonAudio.activeIndex = 0
    for (const i in lessonAudio.list) {
      if (excludeIndex == i) {
        continue
      }
      lessonAudio.list[i].element.currentTime = 0
      lessonAudio.list[i].currentTime = 0
    }
  }
  function playAudio (audio) {
    document.getElementById('audio_'+audio).cloneNode(true).play()
  }

  function onPlaying () {
    lessonAudio.is_playing = true
    if (!lessonAudio.interval) {
      clearInterval(lessonAudio.interval)
      lessonAudio.interval = setInterval(function () {
        lessonAudio.list[lessonAudio.activeIndex].currentTime = lessonAudio.list[lessonAudio.activeIndex].element.currentTime
      }, lessonAudio.intervalLength)
    }
  }
  function onEnded () {
    lessonAudio.list[lessonAudio.activeIndex].currentTime = lessonAudio.list[lessonAudio.activeIndex].element.duration
  }

  return {
    pauseAudio,
    stopAudio,
    playAudio
  }
}

