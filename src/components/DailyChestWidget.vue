<template>
    <q-card flat class="column justify-center bg-transparent relative text-left q-pt-md  full-width overflow-hidden" style="flex: 1;">
      <transition
        appear
        enter-active-class="animated fadeInUp animation-delay-1"
        leave-active-class="animated fadeOutDown ">
        <q-card-section class="text-white text-center q-mx-lg"  v-if="chests.length > 0">
          <div class="text-h6"><b>Ежедневные награды</b></div>
          <div class="text-caption">Заходи каждый день и получай ежедневные бонусы!</div>
        </q-card-section>
      </transition>
      <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut">
        <q-card-section class="q-pa-none q-desc-mx-quart"  v-if="chests.length > 0">
        <swiper
          slidesPerView="1.8"
          :spaceBetween="8"
          :centeredSlides="true"
          @activeIndexChange="change"
          ref="swiperEl"
          @swiper="onSwiper"
        >
          <swiper-slide  v-for="(chest, chestIndex) in chests" :key="`chestIndex-${chestIndex}`" :class="'text-center'">
            <q-card  class="q-push q-my-sm q-mb-md text-white text-center" :style="`background-image: url('${chest.background_image}'); background-size: cover; background-position: center; ${(!chest.is_available && !chest.is_gained) ? 'filter: grayscale(1)' : ''}`">
                  <q-card-section class="q-pa-sm q-pt-none">
                    <div class="text-subtitle1"><b>{{ chest.title }}</b></div>
                    <div class="text-caption">{{ chest.description }}</div>
                  </q-card-section>
                  <q-card-section class="q-pa-none">
                    <q-img :src="chest.image" width="100%" style="filter: drop-shadow(rgba(255, 255, 255, 0.5) 0px 0px 5px)"/>
                  </q-card-section>
                  <q-card-section class="q-px-none">
                    <div class="row q-gutter-sm items-center justify-center" style="margin-bottom: -30px;">
                      <div v-for="(resource, resourceIndex) in chest.reward" :key="`resource-${resourceIndex}`" style="filter: drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.25));">
                          <UserResourceBar :resource="resource" dense no-caption size="26px" push/>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
          </swiper-slide>
        </swiper>
        </q-card-section>
      </transition>
      <q-card-actions class=" justify-center q-px-md"  v-if="chests.length > 0">
          <q-btn v-if="activeChest.is_available && !activeChest.is_gained" class="q-item-blinking " push color="primary" @click="claimItem(activeChest.id)" :loading="buttonLoading" @click.stop="playAudio('click_tiny')">Получить</q-btn>
          <q-btn v-else-if="activeChest.is_gained" push color="positive" icon="check">Получено</q-btn>
          <q-btn v-else  push disable color="grey">Недоступно</q-btn>
      </q-card-actions>
    <q-page-sticky position="top-right" :offset="[16,16]">
      <q-btn push class="col-auto q-ma-xs" color="negative" v-close-popup icon="close" @click.stop="playAudio('click_tiny')"/>
    </q-page-sticky>
    </q-card>
</template>

<script setup >
import { ref, onMounted, watch } from 'vue'
import { api } from '../services/index'
import { useUserStore } from '../stores/user'
import UserResourceBar from './UserResourceBar.vue'
import { CONFIG } from '../config.js'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { useAudio } from '../composables/useAudio'

const { playAudio } = useAudio()

import 'swiper/css'

const { user, getItem } = useUserStore()

const chests = ref([])
const error = ref(false)
const headerShowForce = ref(false)
const buttonLoading = ref(false)
const activeChest = ref({})

const swiperEl = ref(null)
const onSwiper = (swiper) => {
  swiperEl.value = swiper
}
const change = async (event) => {
  activeChest.value = chests.value[event.activeIndex]
}

const load = async (filter) => {
  const chestListResponse = await api.chest.getList({type: 'daily'})
  if (chestListResponse.error) {
    error.value = chestListResponse
    chests.value = []
    return []
  }
  chests.value = chestListResponse
}
const claimItem = async (offer_id) => {
  buttonLoading.value = true
  if(!offer_id) return
  const chestBoughtResponse = await api.chest.buyItem({offer_id})
  if (chestBoughtResponse.error) {
    return;
  }
  buttonLoading.value = false
  await load()
  activeChest.value = chests.value.find((offer) => offer.id == offer_id);
}
const checkActive = () => {
  let activeIndex = chests.value.findIndex((item) => item.is_active);
  if(activeIndex == -1) activeIndex = 0
  swiperEl.value.slideTo(activeIndex)
  activeChest.value = chests.value[activeIndex]
}
onMounted(async() => {
  await load()
  checkActive()
})
</script>
