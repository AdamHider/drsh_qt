<template>
  <div class="row q-py-sm ">
    <div class="col-3 text-center cursor-pointer relative-position" @click="toggleType('lexis')">
      <div class="relative-position inline-block">
        <q-avatar size="48px" :class="filter.lesson_type.includes('lexis') ? 'bg-light-gradient-primary text-white' : 'bg-grey-3 text-grey-7'" icon="border_all"/>
        <transition name="scale">
          <q-badge v-if="filter.lesson_type.includes('lexis')" floating rounded color="red"
            class="q-pa-xs"
            style="border: 2px solid white; top: -4px; right: -4px; z-index: 10;">
            <q-icon name="close" color="white" size="12px" />
          </q-badge>
        </transition>
      </div>
      <div :class="`text-caption q-mt-xs ${(filter.lesson_type.includes('lexis')) ? 'text-primary' : ''}`"><b>Карточки</b></div>
    </div>
    <div class="col-3 text-center cursor-pointer relative-position" @click="toggleType('chat')">
      <div class="relative-position inline-block">
        <q-avatar size="48px" :class="filter.lesson_type.includes('chat') ? 'bg-gradient-red text-white' : 'bg-grey-3 text-grey-7'" icon="forum"/>
        <transition name="scale">
          <q-badge v-if="filter.lesson_type.includes('chat')" floating rounded color="red"
            class="q-pa-xs"
            style="border: 2px solid white; top: -4px; right: -4px; z-index: 10;">
            <q-icon name="close" color="white" size="12px" />
          </q-badge>
        </transition>
      </div>
      <div :class="`text-caption q-mt-xs ${(filter.lesson_type.includes('chat')) ? 'text-red' : ''}`"><b>Чат</b></div>
    </div>
    <div class="col-3 text-center cursor-pointer relative-position" @click="toggleType('syllables')">
      <div class="relative-position inline-block">
        <q-avatar size="48px" :class="filter.lesson_type.includes('syllables') ? 'bg-gradient-blue text-white' : 'bg-grey-3 text-grey-7'" icon="apps"/>
        <transition name="scale">
          <q-badge v-if="filter.lesson_type.includes('syllables')" floating rounded color="red"
            class="q-pa-xs"
            style="border: 2px solid white; top: -4px; right: -4px; z-index: 10;">
            <q-icon name="close" color="white" size="12px" />
          </q-badge>
        </transition>
      </div>
      <div :class="`text-caption q-mt-xs ${(filter.lesson_type.includes('syllables')) ? 'text-blue' : ''}`"><b>Слоги</b></div>
    </div>
    <div class="col-3 text-center cursor-pointer relative-position" @click="toggleType('cryptogram')">
      <div class="relative-position inline-block">
        <q-avatar size="48px" :class="filter.lesson_type.includes('cryptogram') ? 'bg-light-gradient-indigo text-white' : 'bg-grey-3 text-grey-7'" icon="password"/>
        <transition name="scale">
          <q-badge v-if="filter.lesson_type.includes('cryptogram')" floating rounded color="red"
            class="q-pa-xs"
            style="border: 2px solid white; top: -4px; right: -4px; z-index: 10;">
            <q-icon name="close" color="white" size="12px" />
          </q-badge>
        </transition>
      </div>
      <div :class="`text-caption q-mt-xs ${(filter.lesson_type.includes('cryptogram')) ? 'text-indigo' : ''}`"><b>Шифр</b></div>
    </div>
  </div>
  <div class="q-mb-sm">
    <q-input
      class="q-ma-sm"
      standout
      v-model="filter.search"
      placeholder="Поиск планет..."

    >
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const emits = defineEmits(['onChange'])

const filter = ref({
  tags: [],
  lesson_type: [],
  search: ''
})

const props = defineProps({
  filter: Object,
})
const toggleType = (val) => {
  const index = filter.value.lesson_type.indexOf(val);
  if (index > -1) {
    filter.value.lesson_type.splice(index, 1);
  } else {
    filter.value.lesson_type.push(val);
  }
};
watch(filter.value, () => {
  emits('onChange', filter.value)
})

</script>
<style scoped>
/* Анимация появления крестика */
.scale-enter-active, .scale-leave-active {
  transition: transform 0.2s ease;
}
.scale-enter-from, .scale-leave-to {
  transform: scale(0);
}
</style>
