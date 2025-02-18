<template>
  <swiper
    v-if="settings.length > 0"
    slidesPerView="auto"
    :spaceBetween="8"
    :slidesOffsetBefore="16"
    :slidesOffsetAfter="16"
  >
    <swiper-slide v-for="(setting, index) in settings" :key="`setting-${index}`" :class="'text-center'" style="width: fit-content;">
      <q-item  class="rounded-borders bg-grey-2 items-center text-left">
        <q-item-label class="q-mr-sm"><b class="text-h6 text-bold">{{ setting.percentage }}</b>%</q-item-label>
        <q-item-section style="max-width: 100px;">
          <q-item-label caption lines="3" class="text-sm"><b>{{setting.title}}</b></q-item-label>
        </q-item-section>
      </q-item>
    </swiper-slide>
  </swiper>
</template>

<script setup>
import { ref, watch, toRefs, onActivated, onDeactivated } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { useUserStore } from '../stores/user'

import 'swiper/css'

const { getItem } = useUserStore()

const props = defineProps({
  settings: Object
})
const settings = ref([])

onActivated(() => {
  settings.value = []
  if(props.settings.resourceGainModifier.percentage != 0) settings.value.push(props.settings.resourceGainModifier)
  if(props.settings.energyRestorationTime.percentage != 0) settings.value.push(props.settings.energyRestorationTime)
  if(props.settings.energyMaxValue.percentage != 0) settings.value.push(props.settings.energyMaxValue)
})
</script>
<style lang="scss" scoped>

</style>

