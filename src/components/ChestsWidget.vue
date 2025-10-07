<template>
  <q-btn v-if="chests.length > 0" :class="`bg-gradient-${props.color}`" round push size="17px" @click="dailyChestDialog = true" @click.stop="playAudio('click')">
    <q-avatar size="45px"><q-img src="images/icons/chest.png"/></q-avatar>
    <q-badge v-if="availableChests > 0" floating rounded color="secondary" style="width: 20px; height: 20px; box-shadow: rgba(255, 255, 255, 0.51) 0px 0px 0px 2px inset;"><b>{{ availableChests }}</b></q-badge>
  </q-btn>

  <q-dialog v-model="dailyChestDialog" transition-show="fade" transition-hide="fade" maximized persistent backdrop-filter="blur(4px)">

    <q-card flat class="column justify-center bg-transparent relative text-left q-pt-md  full-width overflow-hidden" style="flex: 1;">
        <transition
          appear
          enter-active-class="animated fadeInUp animation-delay-1"
          leave-active-class="animated fadeOutDown ">
          <q-card-section class="text-white text-center q-mx-lg"  v-if="chests.length > 0">
            <div v-if="props.type == 'daily'">
              <div class="text-h6"><b>Ежедневные награды</b></div>
              <div class="text-caption">Заходи каждый день и получай ежедневные бонусы!</div>
            </div>
            <div v-else-if="props.type == 'personal'">
              <div class="text-h6"><b>Персональные награды</b></div>
              <div class="text-caption">Получай персональные бонусы за выдающиеся достижения во вселенной Mektepium!</div>
            </div>
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
          <q-btn v-if="activeChest.is_available && !activeChest.is_gained" class="q-item-blinking " push color="primary" @click="claimItem(activeChest.id)" :loading="buttonLoading">Получить</q-btn>
          <q-btn v-else-if="activeChest.is_gained" push color="positive" icon="check">Получено</q-btn>
          <q-btn v-else  push disable color="grey">Недоступно</q-btn>
      </q-card-actions>
      <q-page-sticky position="top-right" :offset="[16,16]">
        <q-btn push class="col-auto q-ma-xs" color="negative" v-close-popup icon="close" @click.stop="playAudio('click')"/>
      </q-page-sticky>
    </q-card>
  </q-dialog>
</template>

<script setup >
import { ref, onMounted, onActivated, watch, computed } from 'vue'
import { api } from '../services/index'
import { useUserStore } from '../stores/user'
import UserResourceBar from './UserResourceBar.vue'
import { CONFIG } from '../config.js'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { playAudio } from 'src/services/audioService';
import { onBeforeRouteLeave } from 'vue-router'



import 'swiper/css'

const { user, getItem } = useUserStore()
const props = defineProps({
  type: String,
  color: String
})
const availableChests = computed(() => { return chests.value.filter((item) => item.is_available == true).length })
const dailyChestDialog = ref(false)

const chests = ref([])
const error = ref(false)
const headerShowForce = ref(false)
const buttonLoading = ref(false)
const activeChest = ref({})

const swiperEl = ref(null)
const onSwiper = (swiper) => {
  swiperEl.value = swiper
  checkActive()
}
const change = async (event) => {
  activeChest.value = chests.value[event.activeIndex]
}

const load = async (filter) => {
  const chestListResponse = await api.chest.getList({type: props.type})
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
  const chestBoughtResponse = await api.chest.claimItem({offer_id})
  if (chestBoughtResponse.error) {
    return;
  }
  playAudio('gain')
  buttonLoading.value = false
  await load()
  if(chests.value.length == 0) dailyChestDialog.value = false
  activeChest.value = chests.value.find((offer) => offer.id == offer_id);
}
const checkActive = () => {
  let activeIndex = chests.value.findIndex((item) => item.is_active);
  if(activeIndex == -1) activeIndex = 0
  swiperEl.value.slideTo(activeIndex)
  activeChest.value = chests.value[activeIndex]
}
onActivated(async() => {
  await load()
})
onBeforeRouteLeave((to, from) => {
  if (dailyChestDialog.value) {
    dailyChestDialog.value = false
    return false
  }
  return true
})
</script>
