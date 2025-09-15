<template>
  <q-page-container>
    <q-app-header class="bg-white rounded-b-md bordered" reveal>
        <q-btn flat icon="arrow_back"  @click="$router.go(-1);" v:slot="back-button" @click.stop="playAudio('click')"/>
        <q-toolbar-title><b>Платежи и чеки</b></q-toolbar-title>
    </q-app-header>
    <q-page class="bg-white"  style="padding-top: 50px; padding-bottom: 48px;">
        <q-inner-loading :showing="notLoaded">
          <q-spinner-puff size="50px" color="primary" />
        </q-inner-loading>
        <q-list v-if="payments.length > 0" class="q-pa-sm"  >
          <q-item v-for="(payment, paymentIndex) in payments" :key="`paymentIndex-${paymentIndex}`" @click="getItem(payment.id)" class="q-push q-my-sm rounded-sm" clickable v-ripple >
            <q-item-section>
              <q-item-label caption>{{ payment.updated_at	}}</q-item-label>
              <q-item-label class="text-caption">{{ payment.description }}</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-subtitle1">{{ payment.amount }}руб.</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <div v-else-if="!notLoaded" class="text-center q-pa-md">
          <div class="text-subtitle1"><b>Платежей пока нет</b></div>
          <div class="text-caption"><b>Сделай покупку в космо-маркете и они появятся</b></div>
        </div>
        <q-dialog v-model="activePaymentDialog">
          <q-card>
            <q-card-section>
              <div class="text-subtitle1"><b>Чек №{{ activePayment.fiscal_provider_id }}</b></div>
              <div  class="text-caption">{{ activePayment.registered_at }}</div>
            </q-card-section>
            <q-card-section>
              <q-list v-for="(chequeItem, chequeIndex) in activePayment.items" :key="`chequeIndex-${chequeIndex}`">
                <q-item>
                  <q-item-section>
                    <q-item-label caption>{{ chequeItem.description	}}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label caption>{{ chequeItem.amount.value	}}{{ chequeItem.amount.currency	}}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
            <q-card-section>
              <div>Итого:</div>
            </q-card-section>
            <q-card-section>
              <div>Итого:</div>
            </q-card-section>
          </q-card>
        </q-dialog>
    </q-page>
  </q-page-container>
</template>

<script setup >
import { ref, onMounted, onActivated } from 'vue'
import { api } from '../services/index'

const payments = ref([])
const error = ref({})
const notLoaded = ref(true)
const activePayment = ref({})
const activePaymentDialog = ref(false)

const load = async function () {
  const paymentListResponse = await api.payment.getList({})
  notLoaded.value = false
  if (paymentListResponse.error) {
    error.value = paymentListResponse
    return []
  }
  payments.value = paymentListResponse
}
const getItem = async function (id) {
  const paymentItemResponse = await api.payment.getItem({id})
  notLoaded.value = false
  if (paymentItemResponse.error ) {
    error.value = paymentItemResponse
    return []
  }
  if(paymentItemResponse.items?.length > 0){
    activePayment.value = paymentItemResponse.items[0]
    activePaymentDialog.value = true
  }
}


onMounted(() => {
  load()
})

onActivated(() => {
  load()
})

</script>
