<template>
  <q-card flat class="column justify-center bg-transparent relative text-left q-pt-md  full-width overflow-hidden" style="flex: 1;">
    <q-card-section class="text-white text-center q-mx-lg">
      <div class="text-h6"><b>Ежедневные награды</b></div>
      <div class="text-caption">Заходи каждый день и получай ежедневные бонусы!</div>
    </q-card-section>
    <q-card-section class="q-pa-none q-desc-mx-quart">
    <swiper
      slidesPerView="2.5"
      :spaceBetween="8"
      :slidesOffsetBefore="50"
      :slidesOffsetAfter="16"
    >
      <swiper-slide  v-for="(marketOffer, marketOfferIndex) in marketOffers" :key="`marketOfferIndex-${marketOfferIndex}`" :class="'text-center'">
        <q-card  class="q-push q-mt-sm text-center" :style="`background-image: url('${marketOffer.background_image}'); background-size: cover;`">
              <q-card-section class="q-pb-none q-px-none">
                <q-img :src="marketOffer.image" width="100%"  style="margin-top: -50px; filter: drop-shadow(rgba(255, 255, 255, 0.5) 0px 0px 5px)"/>
              </q-card-section>
              <q-card-section class="q-pa-sm q-pt-none">
                <div class="text-subtitle1"><b>{{ marketOffer.title }}</b></div>
                <div class="text-caption">{{ marketOffer.description }}</div>
              </q-card-section>
              <q-card-section class="q-pa-none">
                <div class="row q-gutter-sm items-center justify-center">
                  <div v-for="(resource, resourceIndex) in marketOffer.reward" :key="`resource-${resourceIndex}`" style="filter: drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.25));">
                      <UserResourceBar :resource="resource" dense no-caption size="26px" push/>
                  </div>
                </div>
              </q-card-section>
              <q-card-actions class=" justify-center q-px-md">
                <transition  mode="out-in"
                      enter-active-class="animated zoomIn"
                      leave-active-class="animated zoomOut">
                  <q-btn v-if="!marketOffer.is_bought" class="q-item-blinking full-width" push color="primary" @click="openBuyDialog(marketOffer.id)">{{ marketOffer.price }}₽</q-btn>
                  <q-btn v-else class="q-item-blinking full-width" push color="secondary">Куплено!</q-btn>
                </transition>
              </q-card-actions>
            </q-card>
      </swiper-slide>
    </swiper>
      </q-card-section>
      <q-card-actions class="full-width justify-center">

        <q-btn push class="q-pa-sm" color="negative" v-close-popup>Хорошо</q-btn>
      </q-card-actions>
  </q-card>
</template>

<script setup >
import { ref, onMounted, watch } from 'vue'
import { api } from '../services/index'
import { useUserStore } from '../stores/user'
import UserResourceBar from '../components/UserResourceBar.vue'
import { CONFIG } from '../config.js'
import { Swiper, SwiperSlide } from 'swiper/vue'

import 'swiper/css'

const { user, getItem } = useUserStore()

const marketOffers = ref([])
const error = ref(false)
const headerShowForce = ref(false)
const buyDialog = ref(false)
const activeOffer = ref({})

const load = async (filter) => {
  const marketOfferListResponse = await api.chest.getList({type: 'daily'})
  if (marketOfferListResponse.error) {
    error.value = marketOfferListResponse
    marketOffers.value = []
    return []
  }
  marketOffers.value = marketOfferListResponse
}
const openBuyDialog = async (offer_id) => {
  activeOffer.value = marketOffers.value.find((offer) => offer.id == offer_id);

  buyDialog.value = true
  return;
  const marketOfferBoughtResponse = await api.chest.buyItem({offer_id})
  if (marketOfferBoughtResponse.error) {
    return;
  }
  for(let i in marketOffers.value){
    if(marketOffers.value[i].id == marketOfferBoughtResponse) marketOffers.value[i].is_bought = true;
    setTimeout(() => {
      marketOffers.value[i].is_bought = false;
    }, 2000)
  }
}
onMounted(() => {
  load()
})
</script>
