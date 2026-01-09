<template>
  <div class="full-width q-pa-md flex justify-center" v-if="letterList.length">
    <div class="crypt-layout">
      <div 
        v-for="(word, wIdx) in words" 
        :key="wIdx" 
        class="crypt-word"
      >
        <div v-for="item in word" :key="item.index" class="crypt-unit">
          
          <template v-if="isInput(item.text)">
            <div :id="`input_${extractId(item.text)}`" class="anchor-point"></div>
            <div class="symbol-label">{{ item.symbol }}</div>
          </template>

          <template v-else>
            <div class="static-box">{{ item.text }}</div>
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
  gap: 4px; // Отступы между буквами внутри слова
  white-space: nowrap; // ЗАПРЕТ ПЕРЕНОСА ВНУТРИ СЛОВА
  flex-wrap: nowrap;
}

.crypt-unit { display: flex; flex-direction: column; align-items: center; }

.anchor-point { 
  width: 30px; height: 40px; border-bottom: 2px solid #ccc; 
  display: flex; align-items: center; justify-content: center;
}

.static-box {
  width: 34px; height: 40px; border-bottom: 2px solid #999;
  display: flex; align-items: center; justify-content: center;
  font-weight: bold; font-size: 1.4rem; background: #f0f0f0; color: #555;
  border-radius: 4px 4px 0 0;
}

.symbol-label { font-size: 12px; font-weight: bold; color: #666; margin-top: 4px; }
</style>