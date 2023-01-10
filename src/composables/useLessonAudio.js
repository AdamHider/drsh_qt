import { reactive } from 'vue'
import { api } from '../services/index'
import { CONFIG } from '../config.js'

const lessonAudio = reactive({
  active: {},
  list: [],
  active_index: 0,
  is_playing: false,
  currentTime: false,
  currentTimePre: 0,
  totalDuration: 0,
  breakBetween: 0,
  intervalLength: 10,
  progress: {}
})

export function useLessonAudio () {
  function loadAudio () {
    let loadedCount = 0
    const audioLinks = document.querySelectorAll('.lesson-page .play-audio')
    for (let e = 0; e < audioLinks.length; e++) {
      const source = audioLinks[e].dataset.audio
      audioLinks[e].dataset.audio_index = e
      const audio = new Audio(`${CONFIG.API_HOST}/media/audio/lessons/${source}.mp3?1`)
      audio.currentIndex = e
      audio.onloadeddata = function (e) {
        loadedCount++
        lessonAudio.list[e.target.currentIndex] = {
          element: e.target,
          currentTime: 0
        }
        lessonAudio.totalDuration += e.target.duration
      }
    }
    // lessonAudio.totalDuration += (lessonAudio.breakBetween / 1000 * (audioLinks.length - 1))
  }

  function pauseAudio () {
    lessonAudio.active.pause()
    lessonAudio.is_playing = false
    clearInterval(lessonAudio.progress.interval)
    lessonAudio.progress.interval = false
  }

  function setActiveAudio () {
    lessonAudio.active = lessonAudio.list[lessonAudio.active_index]
    lessonAudio.active.currentTime = 0
  }

  function stopAudio () {
    pauseAudio()
    lessonAudio.list[lessonAudio.active_index].currentTime = 0
    lessonAudio.active_index = 0
    setActiveAudio()
    lessonAudio.is_playing = false
    clearInterval(lessonAudio.progress.interval)
    lessonAudio.progress.interval = false
    lessonAudio.currentTime = 0
    setProgress()
  }

  function playAudio (link) {
    if (lessonAudio.is_playing) stopAudio()
    lessonAudio.active_index = lessonAudio.list.findIndex((audio) => audio.src == `${CONFIG.API_HOST}/media/audio/lessons/${link}.mp3?1`)
    setActiveAudio()
    lessonAudio.active.play().catch((e) => { return false })
    lessonAudio.active.onplaying = function () {
      lessonAudio.is_playing = true
      if (!lessonAudio.progress.interval) {
        clearInterval(lessonAudio.progress.interval)
        lessonAudio.progress.interval = setInterval(function () {
          lessonAudio.currentTime += (lessonAudio.intervalLength / 1000)
          setProgress()
        }, lessonAudio.intervalLength)
      }
    }
    lessonAudio.active.onended = function () {
      lessonAudio.is_playing = false
      clearInterval(lessonAudio.progress.interval)
      lessonAudio.progress.interval = false
    }
  }

  function playAudioAll (index) {
    if (!lessonAudio.is_playing) {
      return false
    }
    if (!lessonAudio.active.currentTime || lessonAudio.active.currentTime == lessonAudio.active.duration) {
      lessonAudio.active = lessonAudio.list[lessonAudio.active_index].element
    }
    lessonAudio.active.play().catch((e) => { return false })
    lessonAudio.active.onplaying = function () {
      if (!lessonAudio.progress.interval) {
        clearInterval(lessonAudio.progress.interval)
        lessonAudio.progress.interval = setInterval(function () {
          lessonAudio.list[lessonAudio.active_index].currentTime = lessonAudio.active.currentTime
          lessonAudio.currentTime += lessonAudio.intervalLength / 1000
          lessonAudio.currentTime = Number((lessonAudio.currentTime).toFixed(2))
          setProgress()
        }, lessonAudio.intervalLength)
      }
    }
    lessonAudio.active.onended = function () {
      if (lessonAudio.list[lessonAudio.active_index + 1]) {
        lessonAudio.active_index++
        if (!lessonAudio.is_playing) {
          return false
        }
        setTimeout(function () {
          return playAudioAll()
        }, lessonAudio.breakBetween)
      } else {
        lessonAudio.active_index = 0
        lessonAudio.currentTime = lessonAudio.totalDuration
        setProgress()
        stopAudio()
      }
      return false
    }
  }

  function setProgress () {
    lessonAudio.progress.value = (lessonAudio.currentTime * 100 / lessonAudio.totalDuration) / 100
    console.log(lessonAudio.list[lessonAudio.active_index])
  }

  return {
    lessonAudio,
    loadAudio,
    pauseAudio,
    setActiveAudio,
    stopAudio,
    playAudio,
    playAudioAll
  }
}
