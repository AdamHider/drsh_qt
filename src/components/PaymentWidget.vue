<template>
  <q-card class="rounded-b-0 q-pt-sm">
    <div id="payment-widget-container"></div>
  </q-card>

</template>

<script setup>
import { ref, watch, nextTick } from 'vue';

const props = defineProps({
  confirmationToken: String
});
const emits = defineEmits(['onPaymentSuccess', 'onPaymentFail'])

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

  //Отображение платежной формы в контейнере
  checkout.render('payment-widget-container');
};

watch(() => props.confirmationToken, async (newToken) => {
  if (newToken) {
    // Ждем, пока DOM обновится
    await nextTick();
    renderYookassaWidget(newToken);
  }
}, { immediate: true });
</script>
