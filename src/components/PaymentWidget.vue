<template>
  <q-dialog v-model="dialogStatus" position="bottom" @before-hide="onHide()">
    <q-card class="rounded-b-0 q-pt-sm">
      <div id="payment-widget-container"></div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { api } from '../services/index'
import { ref, watch, toRefs, nextTick } from 'vue';

const confirmationToken = ref(false)
const paymentId = ref(false)
let pollingInterval = null

const props = defineProps({
  isOpen: Boolean,
  itemId: Number,
  returnUrl: String,
  itemCode: String
});
const emits = defineEmits(['onPaymentSuccess', 'onPaymentFail', 'onHide'])

const isOpen = toRefs(props).isOpen
const dialogStatus = ref(false)

const renderYookassaWidget = async (token) => {
  const checkout = await new YooMoneyCheckoutWidget({
    confirmation_token: token,
    error_callback: function(error) {
      emits('onPaymentFail', error);
    }
  });
  checkout.on('complete', (event) => {
    emits('onPaymentSuccess', event);
    checkout.destroy();
  });
  checkout.on('fail', (event) => {
    emits('onPaymentFail', event);
    checkout.destroy();
  });
  checkout.render('payment-widget-container');
};
const createPayment = async (skill_id) => {
  const paymentCreatedResponse = await api.payment.createItem({item_id: skill_id, item_code: props.itemCode, return_url: props.returnUrl})
  if (paymentCreatedResponse.error) {
    confirmationToken.value = {}
    return;
  }
  confirmationToken.value = paymentCreatedResponse.confirmationToken
  paymentId.value = paymentCreatedResponse.paymentId
  startChecking()
  return;
}
const onHide = () => {
  clearInterval(pollingInterval);
  pollingInterval = null;
  emits('onHide')
}
const handlePaymentSuccess = async () => {
  emits('onPaymentSuccess')
  confirmationToken.value = false
  paymentId.value = false
}

const handlePaymentFail = async (data) => {
  emits('onPaymentFail')
  confirmationToken.value = false
  paymentId.value = false
}
const startChecking = () => {
  pollingInterval = setInterval(async () => {
    try {
      const response =  await api.payment.checkStatus({payment_id: paymentId.value})
      const status = response.status;

      if (status === 'succeeded' || status === 'canceled') {
        // Если статус не pending, останавливаем пуллинг
        clearInterval(pollingInterval);
        pollingInterval = null;

        // Здесь можно показать соответствующее уведомление пользователю
        if (status === 'succeeded') {
          handlePaymentSuccess();
        } else {
          handlePaymentFail();
        }
      }
    } catch (error) {
      console.error('Ошибка пуллинга:', error);
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  }, 3000);
};

watch(() => confirmationToken.value, async (newToken) => {
  if (newToken) {
    await nextTick();
    renderYookassaWidget(newToken);
  }
}, { immediate: true });

watch(() => isOpen.value, () => {
  dialogStatus.value = isOpen.value
  if(isOpen.value) createPayment(props.itemId)
})
</script>
