<template>
  <div class="full-width">
    <q-btn :push="props.push" dense :class="`${props.class}`" :loading="loading" :color="props.color" style="padding-right: 2px;" >
      <div class="flex justify-between items-center">
        <slot/>
      </div>
    </q-btn>
    <div id="robokassa-iframe-container"></div>
  </div>
</template>

<script setup>
import { ref, onActivated } from 'vue'
import { useRoute } from 'vue-router'
import CryptoJS from 'crypto-js';
const route = useRoute()
const props = defineProps({
  class: String,
  color: String,
  label: String,
  sum: Number,
  loading: Boolean,
  push: Boolean
})

const password = 'RGuh8Hn35KxMSzO7b0cx';
const testPassword = 'j2ad1azJZnDD4mltc51u';

const startPayment = () => {
  const merchantLogin = 'mektepium';
  const password1 = testPassword;
  const amount = '50.00';
  const invoiceId = Date.now();
  const description = 'Покупка на Mektepium';

  const signature = CryptoJS.MD5(`${merchantLogin}:${amount}:${invoiceId}:${password1}`).toString();

  Robokassa.StartPayment({
    MerchantLogin: merchantLogin,
    OutSum: amount,
    InvId: invoiceId,
    Description: description,
    SignatureValue: signature,
    Encoding: 'utf-8',
    Culture: 'ru',
    IsTest: 1, // Убери или замени на 0 для реальных платежей
    Target: 'robokassa-iframe-container' // ID контейнера, куда вставится iFrame
  });
};
</script>
