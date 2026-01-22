<template>
  <div>
  <q-list v-if="marketOffers?.length > 0">
    <q-card class="q-push q-ma-md rounded-md" v-for="(marketOffer, marketOfferIndex) in marketOffers" :key="`marketOffer${marketOfferIndex}`" @click="openModal(marketOffer)">
      <q-card-section class="q-pa-none">
        <q-item class="q-py-none">
          <q-item-section avatar style="margin-top: -10px">
            <q-img width="80px" :src="marketOffer.seller.avatar"/>
          </q-item-section>
          <q-item-section class="q-py-sm">
            <div class="text-bold">{{marketOffer.seller.name}}</div>
            <div>
              <span v-if="marketOffer.type == 'exchange'">
                <q-chip class="q-ma-none" color="orange-1" text-color="orange" icon="sync" size="12px"><b>Обмен</b></q-chip>
              </span>
              <span  v-if="marketOffer.type == 'purchase'">
                <q-chip class="q-ma-none" color="blue-1" text-color="blue" icon="shopping_cart" size="12px"><b>Продажа</b></q-chip>
              </span>
              <span v-if="marketOffer.last_rate < marketOffer.current_rate">
                <q-chip class="q-ml-xs" color="red-1" text-color="negative" icon="trending_up" size="12px">
                  <b v-if="marketOffer.type == 'exchange'">{{ marketOffer.current_rate_readable }}</b>
                  <b v-else>Рост</b>
                </q-chip>
              </span>
              <span v-else>
                <q-chip class="q-ml-xs" color="green-1" text-color="positive" icon="trending_down" size="12px">
                  <b v-if="marketOffer.type == 'exchange'">{{ marketOffer.current_rate_readable }}</b>
                  <b v-else>Спад</b>
                </q-chip>
              </span>
            </div>
          </q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right"/>
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-separator  />
      <q-card-section horizontal class=" q-pa-none">
        <q-card-section class="full-width full-height q-pt-sm q-pb-xs">
          <div class="text-sm text-grey">{{ marketOffer.seller.name }} предлагает:</div>
        </q-card-section>
        <q-separator vertical/>
        <q-card-section class="full-width text-right full-height q-pt-sm q-pb-xs">
          <div class="text-sm text-grey">{{ marketOffer.seller.name }} хочет взамен:</div>
        </q-card-section>
      </q-card-section>
      <q-card-section horizontal class="items-center q-pa-none">
        <q-card-section class="full-width full-height q-pt-none q-pb-sm">
          <div class="column items-start q-gutter-xs">
            <div v-for="(resource, resourceIndex) in marketOffer.reward" :key="resourceIndex" >
              <UserResourceBar :resource="resource" dense :no-caption="marketOffer.type !== 'exchange'" :no-value="marketOffer.type == 'exchange'" size="18px" push/>
            </div>
          </div>
        </q-card-section>
        <q-separator vertical/>
        <q-card-section class="full-width full-height q-pt-none q-pb-sm">
          <div  class="column items-end justify-center full-height q-gutter-xs">
            <div v-for="(resource, resourceIndex) in marketOffer.cost" :key="resourceIndex" >
              <UserResourceBar :resource="resource" dense :no-caption="marketOffer.type !== 'exchange'" :no-value="marketOffer.type == 'exchange'"  size="18px" push/>
            </div>
          </div>
        </q-card-section>
      </q-card-section>
    </q-card>
  </q-list>
  <q-dialog v-model="claimDialog"  position="bottom"  @hide="currentOffer = false; buttonLoading = false;">
        <div class="row">
          <div class="col-6">
              <img  :src="`${currentOffer.seller.image}?w=150`" style="z-index: -1;float: right;"/>
          </div>
        </div>
      <q-card class="text-center q-pb-sm allow-overflow rounded-b-0 relative-position">
        <div class="absolute-top text-right" style="top: -10px; right: 10px; z-index: 1" >
          <q-btn push color="negative" class="text-bold" @click="claimDialog = false" @click.stop="playAudio('click')" icon="close"></q-btn>
        </div>
        
        <q-card-section class="text-left">
          <div v-if="currentOffer.type == 'exchange'" class="text-text-subtitle1 text-center text-orange"><b>Обмен ресурсами</b></div>
          <div v-else class="text-text-subtitle1 text-center text-blue"><b>Продажа ресурсов</b></div>
          <div class="text-h6"><b>{{ currentOffer.seller.name }}</b></div>
          <div class="text-caption">{{ currentOffer.seller.description }}</div>
          <div>
            <span v-if="currentOffer.last_rate < currentOffer.current_rate">
              <q-chip class="q-ml-none" color="red-1" text-color="negative" icon="trending_up" size="12px">
                <b v-if="currentOffer.type == 'exchange'">Курс растёт {{currentOffer.current_rate_readable}}</b>
                <b v-else>Цена растёт</b>
              </q-chip>
            </span>
            <span v-else>
              <q-chip class="q-ml-none" color="green-1" text-color="positive" icon="trending_down" size="12px">
                <b v-if="currentOffer.type == 'exchange'">Курс падает ({{currentOffer.current_rate_readable}})</b>
                <b v-else>Цена падает</b>
              </q-chip>
            </span>
          </div>
        </q-card-section>
        <q-separator/>
        <q-card-actions v-if="currentOffer.type == 'exchange'">
          <q-card  flat class="bg-grey-3 full-width">
            <q-card-section horizontal>
              <q-card-section class="full-width full-height ">
                <div class="q-mb-sm"><b>Ты получишь:</b></div>
                <div class="flex justify-center q-gutter-xs">
                  <div v-for="(resource, resourceIndex) in currentOffer.reward" :key="resourceIndex" class="flex no-wrap items-center justify-between">
                    <UserResourceBar class="q-ml-sm" :resource="resource" dense no-caption size="26px" push/>
                  </div>
                </div>
              </q-card-section>
              <q-separator vertical/>
              <q-card-section class="full-width full-height">
                <div class="q-mb-sm"><b>Ты отдашь:</b></div>
                <div  class="">
                  <div v-for="(resource, resourceIndex) in currentOffer.cost" :key="resourceIndex" class="flex items-center justify-center">
                    <UserResourceBar class="q-ml-sm" :resource="resource" dense no-caption size="26px" push/>
                  </div>
                </div>
              </q-card-section>
            </q-card-section>
            <q-separator />
            <q-card-actions class="q-px-md">
              <q-slider v-model="currentOffer.cost[0].quantity" :min="1" :max="user.active?.data.resources[currentOffer.cost[0].code].quantity*1" class="q-mr-sm" @update:model-value="calculateExchange"/>
              <div class="full-width text-center">
                <div class="text-sm text-grey"><q-icon size="16px" name="swipe"/> Прокрути, чтобы изменить количество</div>
              </div>
              
            </q-card-actions>
            
          </q-card>
          <q-btn push color="primary" class="full-width text-bold q-mt-sm q-item-blinking" @click="createExchange()" @click.stop="playAudio('click')" icon="sync">Обменять</q-btn>
        </q-card-actions>
        <q-card-actions v-if="currentOffer.type == 'purchase'">
          <q-card  flat class="bg-grey-3 full-width">
            <q-card-section class="full-width full-height ">
              <div class="q-mb-sm"><b>{{ currentOffer.seller.name }} предлагает:</b></div>
              <div class="flex justify-center q-gutter-xs">
                <div v-for="(resource, resourceIndex) in currentOffer.reward" :key="resourceIndex" >
                  <UserResourceBar :resource="resource" dense no-caption size="26px" push/>
                </div>
              </div>
            </q-card-section>
          </q-card>
          <q-spend-button
            push
            color="gradient-primary"
            class="full-width q-mt-sm"
            :resources="currentOffer.cost ?? []"
            :loading="buttonLoading"
            no-leftover-mark reversed
            label="Купить за"
            @click="openPayment(currentOffer.id)" @click.stop="playAudio('click')"></q-spend-button>
        </q-card-actions>
        <PaymentWidget
            :isOpen="paymentDialog"
            :itemId="currentOffer.id*1"
            itemCode="market_offer"
            returnUrl="market"
            @onHide="paymentDialog = false"
            @onPaymentSuccess="onPaymentSuccess"
            @onPaymentFail="onPaymentFail"/>
      </q-card>
    </q-dialog>
    <q-dialog v-model="paymentSuccessDialog" position="bottom" >
        <q-card class="full-width q-push text-center">
          <q-card-section >
            <div class="text-subtitle1"><b>Спасибо за покупку!</b></div>
            <div class="text-caption">Все прошло успешно, а ресурсы начислены!</div>
          </q-card-section>
        <q-card-actions>
          <q-btn push class="full-width" color="primary" v-close-popup>Хорошо</q-btn>
        </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog v-model="paymentFailDialog">
        <q-card class="full-width q-push text-center">
          <q-card-section >
            <div class="text-subtitle1"><b>Что-то пошло не так!</b></div>
            <div class="text-caption">Возникла ошибка, оплата не удалась.</div>
          </q-card-section>
        <q-card-actions>
          <q-btn push class="full-width" color="primary" v-close-popup>Понятно</q-btn>
        </q-card-actions>
        </q-card>
      </q-dialog>
  </div>
</template>

<script setup >
import { ref, onActivated, onMounted, onDeactivated, onUnmounted, computed } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { api } from '../services/index'
import { useUserStore } from '../stores/user'
import UserResourceBar from '../components/UserResourceBar.vue'
import PaymentWidget from '../components/PaymentWidget.vue'
import { playAudio } from 'src/services/audioService';

const { user } = useUserStore()

const emits = defineEmits(['onAction'])

const marketOffers = ref([])
const error = ref(false)
const paymentDialog = ref(false)
const currentOffer = ref({})
const confirmationToken = ref(false)
const paymentId = ref(false)
let pollingInterval = null

const claimDialog = ref(false)
const buttonLoading = ref(false)
const paymentSuccessDialog = ref(false)
const paymentFailDialog = ref(false)

const load = async () => {
  const marketOfferListResponse = await api.market.getList()
  if (marketOfferListResponse.error) {
    error.value = marketOfferListResponse
    marketOffers.value = []
    return []
  }
  marketOffers.value = marketOfferListResponse
  for(var i in marketOffers.value){
    if(marketOffers.value[i].current_rate > 1){
      marketOffers.value[i].current_rate_readable = `${marketOffers.value[i].current_rate}:1`
    } else {
      marketOffers.value[i].current_rate_readable = `1:${Math.floor(1/marketOffers.value[i].current_rate)}`
    }
  }
}
const calculateExchange = (value) => {
  for(var i in currentOffer.value.reward){
    currentOffer.value.reward[i].quantity = Math.floor(value * currentOffer.value.current_rate);
  }
}

const openModal = function (offer) {
  if (!offer.id) return
  currentOffer.value = offer
  if(currentOffer.value.type == 'exchange'){
    for(var i in currentOffer.value.cost){
      currentOffer.value.cost[i].quantity_cost = user.active?.data.resources[currentOffer.value.cost[i].code].quantity*1
    }
    
  }
  claimDialog.value = true
}
const createExchange = async () => {
  buttonLoading.value = true
  const data = {
    cost: simplifyResources('cost'),
    reward: simplifyResources('reward')
  }
  const exchangeCreatedResponse = await api.market.createExchange(data)
  if (exchangeCreatedResponse.error) {
    error.value = exchangeCreatedResponse
  }
  await load()
  emits('onAction')
  buttonLoading.value = false
  claimDialog.value = false
}
const simplifyResources = (code) => {
  const result = {}
  if(!currentOffer.value[code]) return []
  for(var i in currentOffer.value[code]){
    result[currentOffer.value[code][i].code] = currentOffer.value[code][i].quantity
  }
  return result
}

const openPayment = (offer_id) => {
  buttonLoading.value = true
  currentOffer.value = marketOffers.value.find((offer) => offer.id == offer_id);
  paymentDialog.value = true
}
const onPaymentSuccess = async () => {
  buttonLoading.value = true
  await load()
  emits('onAction')
  paymentDialog.value = false;
  confirmationToken.value = false
  paymentId.value = false
  paymentSuccessDialog.value = true
  buttonLoading.value = false
}
const onPaymentFail = async (data) => {
  buttonLoading.value = true
  await load()
  emits('onAction')
  paymentDialog.value = false;
  confirmationToken.value = false
  paymentId.value = false
  paymentFailDialog.value = true
  buttonLoading.value = false
}
onActivated(async () => {
  load()
})
onMounted(async () => {
  load();
})
onDeactivated(async () => {
  clearInterval(pollingInterval);
  pollingInterval = null;
})
onUnmounted(async () => {
  clearInterval(pollingInterval);
  pollingInterval = null;
})

onBeforeRouteLeave((to, from) => {
  if (paymentDialog.value) {
    paymentDialog.value = false
    return false
  }
  return true
})

</script>
