<template>
  <div v-if="settings.length > 0" class="q-py-sm">
    <swiper
      slidesPerView="auto"
      :spaceBetween="8"
      :slidesOffsetBefore="16"
      :slidesOffsetAfter="16"
    >
      <swiper-slide v-for="(setting, index) in settings" :key="`setting-${index}`" :class="'text-center'" style="width: fit-content;">
        <q-item  class="rounded-borders bg-grey-2 items-center text-left">
          <q-item-label class="q-mr-sm">
            <span v-if="setting.type == 'percentage'"><b class="text-h6 text-bold">{{ setting.percentage }}</b>%</span>
            <span v-else-if="setting.type == 'integer'"><b class="text-h6 text-bold">{{ setting.value }}</b></span>
            <span v-else-if="setting.type == 'boolean'"><b class="text-h6 text-bold">Да</b></span>
          </q-item-label>
          <q-item-section style="max-width: 100px;">
            <q-item-label caption lines="3" class="text-sm"><b>{{setting.title}}</b></q-item-label>
          </q-item-section>
        </q-item>
      </swiper-slide>
    </swiper>
  </div>
  <div v-else>
    <div class="text-caption q-px-md text-grey">У вас пока нет активных эффектов</div>
  </div>

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
  if(props.settings.cobaltGainModifier.status != 'neutral') settings.value.push(props.settings.cobaltGainModifier)
  if(props.settings.experienceGainModifier.status != 'neutral') settings.value.push(props.settings.experienceGainModifier)
  if(props.settings.scienceGainModifier.status != 'neutral') settings.value.push(props.settings.scienceGainModifier)
  if(props.settings.energyRestorationTime.status != 'neutral') settings.value.push(props.settings.energyRestorationTime)
  if(props.settings.energyMaxValue.status != 'neutral') settings.value.push(props.settings.energyMaxValue)

  if(props.settings.lessonAccessDaily.status != 'neutral') settings.value.push(props.settings.lessonAccessDaily)
  if(props.settings.lessonAccessChat.status != 'neutral') settings.value.push(props.settings.lessonAccessChat)
  if(props.settings.lessonAccessQuasar.status != 'neutral') settings.value.push(props.settings.lessonAccessQuasar)

  if(props.settings.lessonAccessLevel.status != 'neutral') settings.value.push(props.settings.lessonAccessLevel)

})
</script>
<style lang="scss" scoped>

</style>

