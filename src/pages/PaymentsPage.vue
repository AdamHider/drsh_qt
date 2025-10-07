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
          <q-item v-for="(payment, paymentIndex) in payments" :key="`paymentIndex-${paymentIndex}`" @click="getItem(payment.id); playAudio('click')" class="q-push q-my-sm rounded-sm" clickable v-ripple >
            <q-item-section>
              <q-item-label caption>{{ payment.created_at	}}</q-item-label>
              <q-item-label class="text-caption">Оплата {{ payment.payment_id }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label class="text-subtitle1">{{ payment.amount }}руб.</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <div v-else-if="!notLoaded" class="text-center q-pa-md">
          <div class="text-subtitle1"><b>Платежей пока нет</b></div>
          <div class="text-caption"><b>Сделай покупку в космо-маркете и они появятся</b></div>
        </div>
        <q-dialog v-model="activePaymentDialog">
          <q-card class="full-width">
            <q-card-section>
              <div class="text-subtitle1"><b>Детали платежа</b></div>
              <div class="text-caption">№ {{ activePayment.payment_id }} от {{ activePayment.created_at }}</div>
            </q-card-section>
            <q-card-section>
              <q-list bordered  class="rounded-borders">
                <q-expansion-item
                  v-for="(cheque, chequeIndex) in activePayment.cheques" :key="`chequeIndex-${chequeIndex}`"
                  icon="receipt_long"
                  :label="`Чек №  ${cheque.fiscal_provider_id}`"  @click.stop="playAudio('click')"
                  :caption="cheque.registered_at">
                  <q-card style="font-size: 12px">
                    <q-card-section class="q-pa-sm q-pb-none">
                      <q-list>
                        <q-item class="q-py-none">
                          <q-item-section>
                            <q-item-label><b>ID чека в ФНС</b></q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-item-label>{{cheque.fiscal_provider_id}}</q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item class="q-py-none">
                          <q-item-section>
                            <q-item-label><b>Статус</b></q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-item-label v-if="activePayment.status == 'succeeded'">Доставлен в ФНС</q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item class="q-py-none">
                          <q-item-section>
                            <q-item-label><b>Контакты для чека</b></q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-item-label>{{ activePayment.email }}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-card-section>
                    <q-card-section class="q-pa-sm ">
                      <q-list bordered class="rounded-borders">
                        <q-item>
                          <q-item-section>
                            <q-item-label><b>Наименование</b></q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-item-label><b>Сумма</b></q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item v-for="(product, productIndex) in cheque.items" :key="`productIndex-${productIndex}`">
                          <q-item-section>
                            <q-item-label >{{ product.description	}}</q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-item-label>{{ product.amount.value	}} <span v-if="product.amount.currency == 'RUB'">₽</span></q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item>
                          <q-item-section>
                            <q-item-label><b>Итого</b></q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-item-label><b>{{ parseFloat(activePayment.amount).toFixed(2) }}₽</b></q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-card-section>
                    <q-card-section class="q-pa-sm q-pt-none">
                      <q-list>
                        <q-item class="q-py-none">
                          <q-item-section>
                            <q-item-label><b>Режим НО</b></q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-item-label>{{activePayment.requisites.tax_mode}}</q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item class="q-py-none">
                          <q-item-section>
                            <q-item-label><b>ИНН</b></q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-item-label>{{activePayment.requisites.tax_id}}</q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item class="q-py-none">
                          <q-item-section>
                            <q-item-label><b>Чек сформировал</b></q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-item-label>{{activePayment.requisites.cheque_former_name}}</q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item class="q-py-none">
                          <q-item-section>
                            <q-item-label><b>ИНН</b></q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-item-label>{{activePayment.requisites.cheque_former_id}}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-card-section>
                    <q-card-actions>
                      <q-btn push color="dark" icon="visibility" class="full-width"  @click.stop="playAudio('click')" :href="`https://lknpd.nalog.ru/api/v1/receipt/${activePayment.requisites.tax_id}/${cheque.fiscal_provider_id}/print`" target="_blank">Печатный чек</q-btn>
                    </q-card-actions>
                  </q-card>
                </q-expansion-item>
              </q-list>
              </q-card-section>
              <q-card-actions>
                <q-btn push color="grey"  class="full-width"  @click.stop="playAudio('click')" v-close-popup><b>Закрыть</b></q-btn>
              </q-card-actions>
          </q-card>
        </q-dialog>
    </q-page>
  </q-page-container>
</template>

<script setup >
import { ref, onMounted, onActivated } from 'vue'
import { api } from '../services/index'
import { playAudio } from 'src/services/audioService';

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
  activePayment.value = payments.value.find((item) => item.id == id)
  const paymentItemResponse = await api.payment.getItem({id})
  notLoaded.value = false
  if (paymentItemResponse.error ) {
    error.value = paymentItemResponse
    return []
  }
  if(paymentItemResponse.items?.length > 0){
    for(var i in paymentItemResponse.items){
      let registered_at = new Date(paymentItemResponse.items[i].registered_at);
      paymentItemResponse.items[i].registered_at = registered_at.toLocaleDateString('ru-RU')+' '+registered_at.toLocaleTimeString('ru-RU')
    }
    activePayment.value.cheques = paymentItemResponse.items
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
