<template>
  <div>
    <div class="q-px-md ">
      <div class="text-subtitle1"><b>Предложения торговцев</b></div>
      <div class="text-caption text-grey">Все предложения обновляются каждый день.</div>
    </div>
  <q-list v-if="marketOffers?.length > 0">
    <q-card flat class="text-white q-ma-md rounded-md" v-for="(marketOffer, marketOfferIndex) in marketOffers" :key="`marketOffer${marketOfferIndex}`" @click="openModal(marketOffer)">
      <q-card-section class="q-pa-none"  :style="{
          backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url(${marketOffer.seller.background_image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 60%',
          paddingBottom: '20px'
        }">
        <q-item class="q-py-none">
          <q-item-section avatar style="width: 100px">
            <q-img width="90px" class="absolute-bottom" :src="marketOffer.seller.avatar" style="left: 10px"/>
          </q-item-section>
          <q-item-section class="q-py-md">
            <div class="text-bold text-shadow" >{{marketOffer.seller.name}}</div>
            <div>
              <span v-if="marketOffer.type == 'exchange'">
                <q-chip class="q-ma-none" color="orange-1" text-color="orange-9" icon="sync" size="12px"><b>Обмен</b></q-chip>
              </span>
              <span  v-if="marketOffer.type == 'purchase'">
                <q-chip class="q-ma-none" color="blue-1" text-color="blue-9" icon="shopping_cart" size="12px"><b>Продажа</b></q-chip>
              </span>
              <span v-if="marketOffer.is_discount">
                <q-chip class="q-ml-xs q-px-sm" color="positive" text-color="white" size="12px" icon="star">
                  <b>{{ marketOffer.current_rate_percentage_text }}</b>
                </q-chip>
              </span>
              <span v-else-if="marketOffer.current_rate_percentage > 0">
                <q-chip class="q-ml-xs q-px-sm" color="red-1" text-color="negative" size="12px" icon="trending_up">
                  <b>{{ marketOffer.current_rate_percentage_text }}</b>
                </q-chip>
              </span>
              <span v-else-if="marketOffer.current_rate_percentage < 0">
                <q-chip class="q-ml-xs q-px-sm" color="green-1" text-color="positive" size="12px" icon="trending_down">
                  <b>{{ marketOffer.current_rate_percentage_text }}</b>
                </q-chip>
              </span>
              <span v-else>
                <q-chip class="q-ml-xs q-px-sm" color="yellow-1" text-color="orange" size="12px" >
                  <b>0%</b>
                </q-chip>
              </span>
            </div>
          </q-item-section>
          <q-item-section side>
            <q-icon color="white" name="chevron_right"/>
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-card-section class=" q-pa-none" style="margin-top: -20px">
        <q-card class="q-push">
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
      </q-card-section>
    </q-card>
  </q-list>
  <q-dialog v-model="claimDialog"  position="bottom"  @hide="currentOffer = false; buttonLoading = false;">
      
      <q-card class="text-center q-pb-sm allow-overflow rounded-b-0 relative-position">
        <div class="absolute-top text-right" style="top: -10px; right: 10px; z-index: 1" >
          <q-btn push color="negative" class="text-bold" @click="claimDialog = false" @click.stop="playAudio('click')" icon="close"></q-btn>
        </div>
        <q-card-section horizontal class="relative-position text-left rounded-t-md q--avoid-card-border" :style="{
          backgroundImage: `linear-gradient(to left, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3)), url(${currentOffer.seller.background_image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 60%',
        }">
          <q-card-section class="col-4">
            <img class="absolute-bottom" width="170px" :src="`${currentOffer.seller.image}?w=270`" style="z-index: 1; left: -30px"/>
          </q-card-section>
          <q-card-section class="text-white q-mb-md">
            <div v-if="currentOffer.type == 'exchange'" class="text-text-subtitle1 text-orange-3"><b>Обмен ресурсами</b></div>
            <div v-else class="text-text-subtitle1 text-blue-3"><b>Продажа ресурсов</b></div>
            <div class="text-h6 text-shadow"><b>{{ currentOffer.seller.name }}</b></div>
            <div class="text-caption text-shadow">{{ currentOffer.seller.description }}</div>
            <div>
              <span v-if="currentOffer.is_discount">
                <q-chip class="q-ml-none" color="positive" text-color="white" icon="star" size="12px">
                  <b v-if="currentOffer.type == 'exchange'">Распродажа</b>
                  <b v-else>Распродажа</b>
                  <b class="q-ml-xs">({{ currentOffer.current_rate_percentage_text }})</b>
                </q-chip>
              </span>
              <span v-else-if="currentOffer.current_rate_percentage > 0">
                <q-chip class="q-ml-none" color="red-1" text-color="negative" icon="trending_up" size="12px">
                  <b v-if="currentOffer.type == 'exchange'">Высокая цена</b>
                  <b v-else>Высокая цена</b>
                  <b class="q-ml-xs">({{ currentOffer.current_rate_percentage_text }})</b>
                </q-chip>
              </span>
              <span v-else-if="currentOffer.current_rate_percentage < 0">
                <q-chip class="q-ml-none" color="green-1" text-color="positive" icon="trending_down" size="12px">
                  <b v-if="currentOffer.type == 'exchange'">Низкая цена</b>
                  <b v-else>Низкая цена</b>
                  <b class="q-ml-xs">({{ currentOffer.current_rate_percentage_text }})</b>
                </q-chip>
              </span>
              <span v-else>
                <q-chip class="q-ml-none" color="yellow-1" text-color="orange" size="12px">
                  <b>Обычная цена</b>
                  <b class="q-ml-xs">(0%)</b>
                </q-chip>
              </span>
              
            </div>
          </q-card-section>
        </q-card-section>
        <q-card-actions v-if="currentOffer.type == 'exchange'" class="bg-white relative-position rounded-t q--avoid-card-border" style="margin-top: -20px; z-index: 10">
          <q-card  flat class="bg-grey-3 full-width">
            <q-card-section horizontal>
              <q-card-section class="full-width full-height q-pt-sm">
                <div class="q-mb-sm"><b>Ты отдашь:</b></div>
                <div  class="">
                  <div v-for="(resource, resourceIndex) in currentOffer.cost" :key="resourceIndex" class="flex items-center justify-center">
                    <UserResourceBar class="q-ml-sm" :resource="resource" dense no-caption size="26px" push/>
                  </div>
                </div>
              </q-card-section>
              <q-separator vertical/>
              <q-card-section class="full-width full-height q-pt-sm">
                <div class="q-mb-sm"><b>Ты получишь:</b></div>
                <div class="flex justify-center q-gutter-xs">
                  <div v-for="(resource, resourceIndex) in currentOffer.reward" :key="resourceIndex" class="flex no-wrap items-center justify-between">
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
          <q-btn push color="primary" class="full-width text-bold q-mt-sm q-item-blinking" :disabled="exchangeDisabled" @click="createExchange()" @click.stop="playAudio('click')" icon="sync">Обменять</q-btn>
        </q-card-actions>
        <q-card-actions v-if="currentOffer.type == 'purchase'"  class="bg-white relative-position rounded-t q--avoid-card-border" style="margin-top: -20px; z-index: 10">
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
    <q-dialog v-model="paymentSuccessDialog" position="bottom" @hide="claimDialog = false">
        <q-card class="full-width q-push text-center">
          <q-card-section >
            <div class="text-subtitle1"><b>Спасибо за покупку!</b></div>
            <div class="text-caption">Полученные ресурсы:</div>
              <div class="flex justify-center q-gutter-xs q-mt-sm">
                <div v-for="(resource, resourceIndex) in currentOffer.reward" :key="resourceIndex" class="flex no-wrap items-center justify-between">
                  <UserResourceBar class="q-ml-sm" :resource="resource" dense no-caption size="26px" push/>
                </div>
              </div>
          </q-card-section>
        <q-card-actions>
          <q-btn push class="full-width" color="primary" v-close-popup>Хорошо</q-btn>
        </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog v-model="paymentFailDialog" @hide="claimDialog = false">
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
const exchangeDisabled = ref(false)

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
}
const calculateExchange = (value) => {
  let allZero = true
  for(var i in currentOffer.value.reward){
    currentOffer.value.reward[i].quantity = Math.floor(value * currentOffer.value.current_rate);
    if(currentOffer.value.reward[i].quantity > 0) allZero = false 
  }
  if(allZero) {
    exchangeDisabled.value = true
  } else {
    exchangeDisabled.value = false
  }
}

const openModal = function (offer) {
  if (!offer.id) return
  currentOffer.value = offer
  if(currentOffer.value.type == 'exchange'){
    for(var i in currentOffer.value.cost){
      currentOffer.value.cost[i].quantity_cost = user.active?.data.resources[currentOffer.value.cost[i].code].quantity*1
      currentOffer.value.cost[i].quantity = 1
    }
    calculateExchange(1)
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
    onPaymentFail()
    return;
  }
  onPaymentSuccess()
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
