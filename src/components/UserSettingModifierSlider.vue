<template>
  <div v-if="modifiers?.length > 0" class="q-py-sm">
    <swiper
      slidesPerView="auto"
      :spaceBetween="8"
      :slidesOffsetBefore="16"
      :slidesOffsetAfter="16"
    >
      <swiper-slide v-for="(modifier, index) in modifiers" :key="`setting-${index}`" :class="'text-center'" style="width: fit-content;">
        <q-item  class="rounded-borders bg-grey-2 items-center text-left">
          <q-item-label class="q-mr-sm">
            <span v-if="modifier.type == 'boolean'"><b class="text-h6 text-bold">Да</b></span>
            <span v-else>
              <b :class="`text-h6 text-bold ${(modifier.is_positive) ? 'text-positive' : 'text-negative'}`">{{ modifier.value }}</b>
            </span>
          </q-item-label>
          <q-item-section style="max-width: 100px;">
            <q-item-label caption lines="1" class="text-sm">
              <b v-if="modifier.source_code == 'skill'" class="text-blue-7">{{modifier.title}}</b>
              <b v-else-if="modifier.source_code == 'character'" class="text-purple-7">{{modifier.title}}</b>
              <b v-else-if="modifier.source_code == 'streak'" class="text-flame">{{modifier.title}}</b>
              <b v-else-if="modifier.source_code == 'bonus'" class="text-green-7">{{modifier.title}}</b>
              <b v-else-if="modifier.source_code == 'penalty'" class="text-red-7">{{modifier.title}}</b>
            </q-item-label>
            <q-item-label caption lines="3" class="text-sm"><b>{{modifier.setting.title}}</b></q-item-label>
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
  modifiers: Array
})

const modifiers = toRefs(props).modifiers

</script>
<style lang="scss" scoped>

</style>

