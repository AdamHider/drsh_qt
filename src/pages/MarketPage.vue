<template>
  <q-page-container>
    <q-app-header class="transparent text-white rounded-b-md" contentClass="justify-between">
      <div class="flex full-width justify-center">
        <UserResourceBar v-if="user.active?.data.resources" :resource="user.active?.data.resources.terralit" dense no-caption size="24px" push />
        <UserResourceBar v-if="user.active?.data.resources" :resource="user.active?.data.resources.science" dense no-caption size="24px" push class="q-mx-sm"/>
        <UserResourceBar v-if="user.active?.data.resources" :resource="user.active?.data.resources.isonit" dense no-caption size="24px" push/>
      </div>
    </q-app-header>
    <q-page class="column justify-center content-start text-center full-width" style="padding-top: 50px;">
      <div class="page-background fixed-top full-width"  style="height: 300px; background-image: url('/images/market/main_background.jpg'); background-size: cover; background-position: bottom;"></div>
      <q-card class="text-center transparent no-shadow full-width justify-center column " style="position: relative;">
          <q-card-section class="text-white text-left flex flex-no-wrap items-center q-pa-none q-pt-md">
            <div class="col">
              <q-img width="200px" src="/images/market/character.png" style="max-width: 100%;"/>
            </div>
            <div class="col q-pa-sm"  style="text-shadow: 2px 2px 5px black;">
              <div class="text-h6"><b>Галактический базар</b></div>
              <div class="text-caption">Время пополнить запасы!</div>
            </div>
          </q-card-section>
      </q-card>
      <q-card flat class="relative text-left q-pt-md rounded-borders rounded-b-0 full-width overflow-hidden" style="flex: 1;">
          <q-card-section class="q-pa-none">

            <MarketOfferList/>
          </q-card-section>
          <q-card-section class=" q-pb-none">
            <div class="text-subtitle1"><b>Юридическая информация</b></div>
            <div class="text-caption">Здесь можно ознакомиться с условиями галактического базара.</div>
          </q-card-section>
          <q-card-section class="q-pa-none q-pt-none">
            <q-list class="q-my-sm" separator>
              <q-item clickable v-ripple exact to="/payments" class="text-grey-10" @click.stop="playAudio('click')">
                <q-item-section><b>Список чеков</b></q-item-section>
                <q-item-section side>
                  <q-icon name="chevron_right" />
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple exact :href="'https://mektepium.com/requisites'" target="_blank" class="text-grey-10" @click.stop="playAudio('click')">
                <q-item-section><b>Реквизиты и контактные данные</b></q-item-section>
                <q-item-section side>
                  <q-icon name="chevron_right" />
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple exact :href="'https://mektepium.com/return'" target="_blank" class="text-grey-10" @click.stop="playAudio('click')">
                <q-item-section><b>Доставка и возврат</b></q-item-section>
                <q-item-section side>
                  <q-icon name="chevron_right" />
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple exact :href="'https://mektepium.com/terms'" target="_blank" class="text-grey-10" @click.stop="playAudio('click')">
                <q-item-section><b>Правила пользования</b></q-item-section>
                <q-item-section side>
                  <q-icon name="chevron_right" />
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple exact :href="'https://mektepium.com/privacy'" target="_blank" class="text-grey-10" @click.stop="playAudio('click')">
                <q-item-section><b>Политика конфиденциальности</b></q-item-section>
                <q-item-section side>
                  <q-icon name="chevron_right" />
                </q-item-section>
              </q-item>
            </q-list>

          </q-card-section>
      </q-card>
      <q-dialog v-model="paymentStatusDialog">
        <q-card class="full-width q-push text-white text-center relative" flat :style="`background-image: url('${activeOffer.background_image}'); background-size: cover;`">
          <q-card-section class="q-pb-none q-px-none">
            <q-img :src="activeOffer.image" width="100%" style="filter: drop-shadow(rgba(255, 255, 255, 0.5) 0px 0px 5px)"/>
          </q-card-section>
          <q-card-section class="q-pa-sm q-pt-none" style="text-shadow: 0px 1px 2px black">
            <div class="text-subtitle1"><b>Ресурсы получены!</b></div>
            <div class="text-caption">Операция прошла успешно!</div>
          </q-card-section>
          <q-card-section class="q-pa-none">
            <div class="row q-gutter-sm items-center justify-center">
              <div v-for="(resource, resourceIndex) in activeOffer.reward" :key="`resource-${resourceIndex}`" style="filter: drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.25));">
                  <UserResourceBar :resource="resource" dense no-caption size="26px" push/>
              </div>
            </div>
          </q-card-section>
          <q-card-actions class="justify-center">
            <q-btn push v-close-popup color="primary">Отлично</q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
      <PaymentWidget
          :isOpen="buyDialog"
          :itemId="activeOffer.id*1"
          itemCode="chest"
          returnUrl="market"
          @onHide="buyDialog = false; activeOffer={}"
          :confirmationToken="confirmationToken"
          @onPaymentSuccess="handlePaymentSuccess"
          @onPaymentFail="handlePaymentFail"/>
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
    </q-page>
    <q-dialog v-model="inviteDialog" position="bottom" transition-hide="fade" @hide="getItem()">
      <UserInvitaionWidget/>
    </q-dialog>
  </q-page-container>
</template>

<script setup >
import { ref, onActivated, onMounted, onDeactivated, onUnmounted } from 'vue'
import { api } from '../services/index'
import { useUserStore } from '../stores/user'
import UserResourceBar from '../components/UserResourceBar.vue'
import UserInvitaionWidget from '../components/UserInvitaionWidget.vue'
import PaymentWidget from '../components/PaymentWidget.vue'
import { playAudio } from 'src/services/audioService';
import { useRoute, onBeforeRouteLeave } from 'vue-router'
import MarketOfferList from 'src/components/MarketOfferList.vue'

const route = useRoute()

const { user, getItem } = useUserStore()

const marketOffers = ref([])
const error = ref(false)
const buyDialog = ref(false)
const paymentStatusDialog = ref(false)
const paymentSuccessDialog = ref(false)
const paymentFailDialog = ref(false)
const activeOffer = ref({})
const confirmationToken = ref(false)
const paymentId = ref(false)
let pollingInterval = null
const inviteDialog = ref(false)

const handlePaymentSuccess = async () => {
  markItem('is_bought')
  activeOffer.value = {}
  buyDialog.value = false;
  getItem()
  confirmationToken.value = false
  paymentId.value = false
  paymentSuccessDialog.value = true
}

const handlePaymentFail = async (data) => {
  markItem('is_error')
  activeOffer.value = {}
  buyDialog.value = false;
  await getItem()
  confirmationToken.value = false
  paymentId.value = false
  paymentFailDialog.value = true
}
const markItem = (key) => {
  for(let i in marketOffers.value){
    if(marketOffers.value[i].id == activeOffer.value.id) marketOffers.value[i][key] = true;
    setTimeout(() => {
      marketOffers.value[i][key] = false;
    }, 2000)
  }
}

onDeactivated(async () => {
  clearInterval(pollingInterval);
  pollingInterval = null;
})
onUnmounted(async () => {
  clearInterval(pollingInterval);
  pollingInterval = null;
})
onBeforeRouteLeave((to, from) => {
  if (inviteDialog.value) {
    inviteDialog.value = false
    return false
  }
  if (paymentStatusDialog.value) {
    paymentStatusDialog.value = false
    return false
  }
  if (buyDialog.value) {
    buyDialog.value = false
    return false
  }
  return true
})
</script>
