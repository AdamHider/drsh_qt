<template>
  <div>
  <q-list v-if="marketOffers?.length > 0">
    <q-card class="q-push q-ma-md rounded-md" v-for="(marketOffer, marketOfferIndex) in marketOffers" :key="`marketOffer${marketOfferIndex}`" @click="openModal(marketOffer)">
      <q-card-section class="q-pa-none">
        <q-item class="q-py-none">
          <q-item-section avatar style="margin-top: -10px">
            <q-img width="70px" :src="marketOffer.seller.avatar"/>
          </q-item-section>
          <q-item-section class="q-py-sm">
            <div class="text-bold">{{marketOffer.seller.name}}</div>
            <div>
              <span v-if="marketOffer.type == 'exchange'">
                <q-chip class="q-ma-none" color="orange-1" text-color="orange" icon="sync" size="12px"><b>Обмен</b></q-chip>
              </span>
              <span  v-if="marketOffer.type == 'purchase'">
                <q-chip class="q-ma-none" color="blue-1" text-color="blue" icon="shopping_cart" size="12px"><b>Покупка</b></q-chip>
              </span>
              <span v-if="marketOffer.last_rate < marketOffer.current_rate">
                <q-chip class="q-ml-xs" color="red-1" text-color="negative" icon="trending_up" size="12px"><b>{{marketOffer.current_rate}}</b></q-chip>
              </span>
              <span v-else>
                <q-chip class="q-ml-xs" color="green-1" text-color="positive" icon="trending_down" size="12px"><b>{{marketOffer.current_rate}}</b></q-chip>
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
        
        <q-card-section>
          <div class="text-h6"><b>{{ currentOffer.seller.name }}</b></div>
          <div class="text-caption">{{ currentOffer.seller.description }}</div>
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
          <q-btn push color="primary" class="full-width text-bold q-mt-sm q-item-blinking" @click="openPayment(currentOffer.id)" @click.stop="playAudio('click')" icon="sync">Обменять</q-btn>
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
            itemCode="skill"
            returnUrl="skills"
            @onHide="paymentDialog = false"
            @onPaymentSuccess="onPaymentSuccess"
            @onPaymentFail="onPaymentFail"/>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup >
import { ref, onActivated, onMounted, onDeactivated, onUnmounted } from 'vue'
import { api } from '../services/index'
import { useUserStore } from '../stores/user'
import UserResourceBar from '../components/UserResourceBar.vue'
import PaymentWidget from '../components/PaymentWidget.vue'
import { playAudio } from 'src/services/audioService';

const { user } = useUserStore()

const marketOffers = ref([])
const error = ref(false)
const paymentDialog = ref(false)
const activeOffer = ref({})
const currentOffer = ref({})
const claimDialog = ref(false)
const buttonLoading = ref(false)



const load = async (filter) => {
  const marketOfferListResponse = await api.market_offer.getList()
  if (marketOfferListResponse.error) {
    error.value = marketOfferListResponse
    marketOffers.value = []
    return []
  }
  marketOffers.value = marketOfferListResponse
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
    currentOffer.value.cost[0].quantity_cost = user.active?.data.resources[currentOffer.value.cost[0].code].quantity*1
  }
  claimDialog.value = true
}
const openPayment = (offer_id) => {
  buttonLoading.value = true
  activeOffer.value = marketOffers.value.find((offer) => offer.id == offer_id);
  paymentDialog.value = true
}
const onPaymentSuccess = async () => {
  currentSkill.value = {}
  emit('onClaim')
  claimDialog.value = false
  buttonLoading.value = false
}
const onPaymentFail = async (data) => {
  currentSkill.value = {}
  buyDialog.value = false;
  emit('onClaim')
  claimDialog.value = false
  buttonLoading.value = false
}
onActivated(async () => {
  load()
})
onMounted(async () => {
  load();
})

</script>
