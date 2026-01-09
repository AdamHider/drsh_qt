<script setup>
import { ref, reactive, watch, onMounted, nextTick } from 'vue'
import { useLesson } from '../../../composables/useLesson'
import { playAudio } from 'src/services/audioService'

const emits = defineEmits(['update-answer'])
const { lesson } = useLesson()

const currentIndex = ref(null)
const formData = reactive({ fields: [] })
const completedLetters = reactive(new Set())

const keyboardRows = [
  "ЙЦУКЕНГШЩЗХЪ".split(""),
  "ФЫВАПРОЛДЖЭ".split(""),
  "ЯЧСМИТЬБЮ".split("")
]

const isLetterInMapping = (key) => !!lesson.active.page?.data?.mapping?.[key]

// Обновленная логика подсчета с учетом структуры field.value.text
const updateCompletedStatus = () => {
  const data = lesson.active.page?.data
  if (!data?.mapping || !data?.letter_list) return

  completedLetters.clear()
  const mapping = data.mapping
  const letterList = data.letter_list

  for (const char in mapping) {
    const targetSymbol = String(mapping[char])

    // 1. Сколько всего таких цифр в шифре
    const totalPositions = letterList.filter(item => String(item.symbol) === targetSymbol).length

    // 2. Сколько букв уже открыто сервером в тексте
    const openedByServer = letterList.filter(item => item.text === char).length

    // 3. Сколько букв ввел пользователь (смотрим в field.value.text)
    const typedByUser = formData.fields.filter(f => f.value.text === char).length

    if (totalPositions > 0 && (typedByUser + openedByServer) >= totalPositions) {
      completedLetters.add(char)
    }
  }
}

const renderFields = async () => {
  if (!lesson.active.page?.fields) return

  await nextTick()

  // Очищаем текущие поля перед заполнением (важно для реактивности)
  formData.fields = []

  // Используем вашу структуру цикла и объектов
  for (const k in lesson.active.page.fields) {
    const field = lesson.active.page.fields[k]
    let value = {
      text: ''
    }
    if (field.answer) {
      value.text = field.answer.value
      value.is_finished = true
    }

    formData.fields.push({
      value,
      index: field.index,
      answer: field.answer,
      syllables: field.syllables,
      scheme: field.scheme
    })
  }

  if (currentIndex.value === null && formData.fields.length > 0) {
    const firstEmpty = formData.fields.findIndex(f => !f.value.text)
    currentIndex.value = firstEmpty !== -1 ? firstEmpty : 0
  }

  updateCompletedStatus()
}

const selectLetter = (letter) => {
  if (currentIndex.value === null) return
  playAudio('click')

  // Записываем букву в вашу структуру
  formData.fields[currentIndex.value].value.text = letter

  updateCompletedStatus()

  const nextEmpty = formData.fields.findIndex((f, i) => i > currentIndex.value && !f.value.text)
  if (nextEmpty !== -1) currentIndex.value = nextEmpty

  emits('update-answer', formData.fields)
}

const clearLetter = () => {
  if (currentIndex.value === null) return
  formData.fields[currentIndex.value].value.text = ''
  updateCompletedStatus()
  emits('update-answer', formData.fields)
}

onMounted(renderFields)
watch(() => lesson.active.page, renderFields, { deep: true, immediate: true })
</script>

<template>
  <div v-if="formData.fields.length > 0" class="cryptogram-form bg-grey-3 q-pa-sm">
    <div v-for="(field, index) in formData.fields" :key="field.index">
      <Teleport :to="`#input_${field.index}`">
        <div
          @click="currentIndex = index"
          :class="['q-crypt-field', { 'is-active': index === currentIndex }]"
        >
          <span :class="field.value.text ? 'text-primary' : 'text-grey-4'">
            {{ field.value.text || '?' }}
          </span>
        </div>
      </Teleport>
    </div>

    <div class="keyboard-container q-mt-md" v-if="currentIndex !== null">
      <div v-for="(row, rIdx) in keyboardRows" :key="rIdx" class="row no-wrap justify-center q-mb-xs">
        <q-btn
          v-for="key in row" :key="key" :label="key"
          @click="selectLetter(key)"
          flat dense
          :class="[
            'key-cap',
            {
              'key-absent': !isLetterInMapping(key),
              'key-completed': completedLetters.has(key)
            }
          ]"
          :disable="!isLetterInMapping(key)"
        />
        <q-btn v-if="rIdx === 2" icon="backspace" @click="clearLetter" class="key-cap key-del" flat dense />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.q-crypt-field {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.4rem;
  cursor: pointer;
  transition: background 0.2s;

  &.is-active {
    background: rgba($primary, 0.15);
    outline: 2px solid $primary;
    border-radius: 4px;
  }
}

.text-grey-4 {
  color: #ccc; // Цвет знака вопроса
}

.keyboard-container {
  max-width: 650px;
  margin: 0 auto;
}

.key-cap {
  background: white;
  margin: 2px;
  flex: 1;
  height: 48px;
  min-width: 30px;
  font-weight: bold;
  font-size: 1.1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
  border-radius: 4px;
  color: $primary;
  transition: all 0.2s ease;

  // Буквы, которых нет в маппинге (не используются в шифре)
  &.key-absent {
    opacity: 0.1;
    background: #e0e0e0;
    pointer-events: none;
  }

  // Буква заполнена во всех положенных местах
  &.key-completed {
    background: #cfd8dc !important;
    color: #90a4ae !important;
    box-shadow: none;
    opacity: 0.7;
    // Мы не ставим disable, чтобы юзер мог исправить ошибку,
    // если он ввел букву не туда.
  }

  &:active {
    transform: translateY(2px);
    box-shadow: none;
  }
}

.key-del {
  background: #90a4ae;
  color: white !important;
}

// Адаптив для мобилок
@media (max-width: 600px) {
  .key-cap {
    height: 42px;
    margin: 1px;
    font-size: 0.9rem;
    min-width: 24px;
  }
}
</style>
