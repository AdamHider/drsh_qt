<template>
  <div class="full-width q-pa-md flex justify-center" v-if="letterList.length">
    <div class="crypt-layout">
      <div v-for="(word, wIdx) in words" :key="wIdx" class="crypt-word">
        <div v-for="item in word" :key="item.index" class="crypt-unit">
          <template v-if="isInput(item.text)">
            <div :id="`input_${extractId(item.text)}`" class="anchor-point"></div>
            <div class="symbol-label">{{ item.symbol }}</div>
          </template>
          <template v-else>
            <div :class="`q-lesson-field ${(!item.symbol) ? 'non-symbol' : ''}`">
              <span class="q-lesson-field-value">{{ item.text }}</span>
            </div>
            <div class="symbol-label">{{ item.symbol }}</div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useLesson } from '../../../composables/useLesson'

const emits = defineEmits(['onRendered'])
const { lesson } = useLesson()

const letterList = computed(() => lesson.active.page?.data?.letter_list || [])

// Группировка letter_list в массив слов
const words = computed(() => {
  const result = []
  let currentWord = []

  letterList.value.forEach((item) => {
    if (item.text === ' ') {
      if (currentWord.length > 0) result.push(currentWord)
      currentWord = []
    } else {
      currentWord.push(item)
    }
  })
  if (currentWord.length > 0) result.push(currentWord)
  return result
})

const isInput = (text) => text && text.includes('{{input')
const extractId = (text) => text?.match(/input(\d+)/)?.[1]

onMounted(() => emits('onRendered', true))
</script>

<style lang="scss" scoped>
.crypt-layout { 
  display: flex; 
  flex-wrap: wrap; 
  justify-content: center; 
  gap: 20px 24px; // Отступы между словами
  max-width: 1000px;
}

.crypt-word { 
  display: flex; 
  gap: 2px;
  white-space: nowrap;
  flex-wrap: nowrap;
}

.crypt-unit { display: flex; flex-direction: column; align-items: center; }

.q-lesson-field {
  vertical-align: middle;
  display: inline-block;
  position: relative;
  width: 25px;
  box-shadow: none;
  min-height: 2.3em;
  &:before{
    content: "";
    position: absolute;
    left: 0;
    top: 4px;
    width: 100%;
    height: 100%;
    border-bottom: 2px dotted #00000083;
    border-radius: 8px 8px 0 0  !important;
    box-shadow: none !important;
    opacity: 1;
    animation:none  !important;
    transition: 0.3s all ease;
  }
  &.non-symbol:before{
    display: none;
  }
  .q-lesson-field-value{
    margin: 0;
    font-size: 1.2em;
    padding: 0.4em 0;
    font-weight: bold;
    width: 30px;
    display: block;
    text-align: center;
    height: auto;
    background: none !important;
    box-shadow: none !important;
    border: none;
  }
}

.symbol-label { font-size: 12px; font-weight: bold; color: #666; margin-top: 6px; }
</style>