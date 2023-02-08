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

export function useLessonAudio () {
  function loadAudio () {
    lessonAudio.list = []
    lessonAudio.activeIndex = 0
    const audioLinks = document.querySelectorAll('.lesson-page .play-audio')
    for (let e = 0; e < audioLinks.length; e++) {
      if (!audioLinks[e].dataset.audio || audioLinks[e].dataset.audio == 'false') continue
      const source = audioLinks[e].dataset.audio
      audioLinks[e].dataset.audio_index = e
      const audio = new Audio(`${CONFIG.API_HOST}/audio/${source}.mp3?1`)
      audio.currentIndex = e
      audio.currentFilename = source
      audio.onloadeddata = function (e) {
        lessonAudio.list[e.target.currentIndex] = {
          element: e.target,
          currentTime: 0,
          filename: e.target.currentFilename
        }
      }
    }
  }

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
  function fitTimeline (index) {
    for (let i = 0; i < index; i++) {
      if (lessonAudio.list[i]) {
        lessonAudio.list[i].currentTime = lessonAudio.list[i].element.duration
      }
    }
  }

  function playAudio (link) {
    if (lessonAudio.list.length == 0) return
    const activeIndex = lessonAudio.list.findIndex((audio) => audio?.element.src == `${CONFIG.API_HOST}/media/audio/lessons/${link}.mp3?1`)
    if (activeIndex == -1) return false
    stopAudio(activeIndex)
    lessonAudio.activeIndex = activeIndex
    fitTimeline(lessonAudio.activeIndex)
    lessonAudio.list[lessonAudio.activeIndex].element.play().catch((e) => { return false })
    lessonAudio.list[lessonAudio.activeIndex].element.onplaying = onPlaying()
    lessonAudio.list[lessonAudio.activeIndex].element.onended = function () {
      onEnded()
      lessonAudio.is_playing = false
      pauseAudio()
      if (lessonAudio.list[lessonAudio.activeIndex + 1]) {
        lessonAudio.activeIndex++
      } else {
        stopAudio()
      }
    }
  }

  function playAudioAll () {
    if (!lessonAudio.is_playing) {
      return false
    }
    lessonAudio.list[lessonAudio.activeIndex].element.play().catch((e) => { return false })
    lessonAudio.list[lessonAudio.activeIndex].element.onplaying = onPlaying()
    lessonAudio.list[lessonAudio.activeIndex].element.onended = function () {
      onEnded()
      if (lessonAudio.list[lessonAudio.activeIndex + 1]) {
        lessonAudio.activeIndex++
        if (!lessonAudio.is_playing) {
          return false
        }
        setTimeout(function () {
          return playAudioAll()
        }, lessonAudio.breakBetween)
      } else {
        stopAudio()
      }
      return false
    }
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
    lessonAudio,
    loadAudio,
    pauseAudio,
    stopAudio,
    playAudio,
    playAudioAll
  }
}

watch(() => lesson.active.page?.header?.index, async (newData, oldData) => {
  if (useLessonAudio().lessonAudio.list.length > 0) {
    useLessonAudio().stopAudio()
  }
})
