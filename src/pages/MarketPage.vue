<template>
  <q-page-container>
    <q-app-header class="transparent text-white rounded-b-md" reveal :showForce="headerShowForce">
      <q-btn flat icon="arrow_back"  @click="$router.go(-1);" v:slot="back-button"/>
      <UserResourceBar v-if="user.active?.data.resources" :resource="user.active?.data.resources.terralit" dense no-caption size="24px" push />
      <UserResourceBar v-if="user.active?.data.resources" :resource="user.active?.data.resources.science" dense no-caption size="24px" push class="q-mx-sm"/>
      <UserResourceBar v-if="user.active?.data.resources" :resource="user.active?.data.resources.isonit" dense no-caption size="24px" push/>
    </q-app-header>
    <q-page class="column justify-center content-start text-center full-width" style="padding-top: 50px;">
      <div class="page-background fixed-top full-width"  style="height: 300px; background-image: url('/images/market/main_background.jpg'); background-size: cover; background-position: bottom;"></div>
      <q-card class="text-center transparent no-shadow full-width justify-center column " style="position: relative;">
          <q-card-section class="text-white text-left flex flex-no-wrap items-center q-pa-none q-pt-md">
            <div class="col">
              <q-img width="200px" src="/images/market/character.png" style="max-width: 100%;"/>
            </div>
            <div class="col q-pa-sm"  style="text-shadow: 2px 2px 5px black;">
              <div class="text-h6"><b>Космо-маркет</b></div>
              <div class="text-caption">Время пополнить запасы!</div>
            </div>
          </q-card-section>
      </q-card>
      <q-card flat class="relative text-left q-pt-md q-pb-md rounded-borders rounded-b-0 full-width" style="flex: 1;">
          <q-card-section>
            <div class="row q-pb-sm">
              <div :class="`col col-${12/marketOffer.priority} q-pa-sm q-mt-sm`" v-for="(marketOffer, marketOfferIndex) in marketOffers" :key="`marketOfferIndex-${marketOfferIndex}`">
                <q-card v-if="marketOffer.priority == 1" class="text-left q-push text-white q-mb-md" :style="`background-image: url('${marketOffer.background_image}'); background-size: cover;`">
                  <q-card-section horizontal class="q-pa-sm items-center">
                    <q-img :src="marketOffer.image" width="50%"  style="margin-top: -50px"/>
                    <q-card-section class="q-pt-none">
                      <div class="text-h6"><b>{{ marketOffer.title }}</b></div>
                      <div class="text-caption"><b>{{ marketOffer.description }}</b></div>
                    </q-card-section>
                  </q-card-section>
                  <q-card-section class="q-pa-none">
                    <div class="row q-gutter-sm items-center justify-center">
                      <div v-for="(resource, resourceIndex) in marketOffer.reward" :key="`resource-${resourceIndex}`" >
                          <UserResourceBar :resource="resource" dense no-caption size="26px" push/>
                      </div>
                    </div>
                  </q-card-section>
                  <q-card-actions class="full-width justify-center q-px-md" style="margin-bottom: -30px">
                    <q-btn class="q-item-blinking full-width" push color="primary">{{ marketOffer.price }} руб.</q-btn>
                  </q-card-actions>
                </q-card>
                <q-card v-else-if="marketOffer.priority == 2" class="q-push q-mt-sm text-center">
                  <q-card-section class="q-pb-none q-px-none">
                    <q-img :src="marketOffer.image" width="100%"  style="margin-top: -50px"/>
                  </q-card-section>
                  <q-card-section class="q-pa-sm q-pt-none">
                    <div class="text-subtitle1"><b>{{ marketOffer.title }}</b></div>
                    <div class="text-caption"><b>{{ marketOffer.description }}</b></div>
                  </q-card-section>
                  <q-card-section class="q-pa-none">
                    <div class="row q-gutter-sm items-center justify-center">
                      <div v-for="(resource, resourceIndex) in marketOffer.reward" :key="`resource-${resourceIndex}`" >
                          <UserResourceBar :resource="resource" dense no-caption size="26px" push/>
                      </div>
                    </div>
                  </q-card-section>
                  <q-card-actions class="full-width justify-center q-px-md" style="margin-bottom: -30px">
                    <q-btn class="q-item-blinking full-width" push color="primary">{{ marketOffer.price }} RUB</q-btn>
                  </q-card-actions>
                </q-card>
              </div>
            </div>
          </q-card-section>
      </q-card>
    </q-page>
  </q-page-container>
</template>

<script setup >
import { ref, onActivated, watch } from 'vue'
import { api } from '../services/index'
import { useUserStore } from '../stores/user'
import UserResourceBar from '../components/UserResourceBar.vue'

const { user, getItem } = useUserStore()

const marketOffers = ref([])
const error = ref(false)
const headerShowForce = ref(false)

const load = async function (filter) {
  const marketOfferListResponse = await api.market_offer.getList({})
  if (marketOfferListResponse.error) {
    error.value = marketOfferListResponse
    marketOffers.value = []
    return []
  }
  marketOffers.value = marketOfferListResponse
}
const reload = async function () {
  await getItem()
  load()
}
onActivated(() => {
  load()
})
</script>
