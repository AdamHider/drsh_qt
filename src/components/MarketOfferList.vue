<template>
  <div>
  <q-list v-if="marketOffers?.length > 0">
    <q-card class="q-push q-ma-md rounded-md" v-for="(marketOffer, marketOfferIndex) in marketOffers" :key="`marketOffer${marketOfferIndex}`">
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
                <q-avatar class="q-ml-xs" size="sm" font-size="14px" color="red-1" text-color="negative" icon="trending_up" />
              </span>
              <span v-else>
                <q-avatar class="q-ml-xs" size="sm" font-size="14px" color="green-1" text-color="positive" icon="trending_down" />
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
  <q-dialog v-model="claimDialog"  position="bottom" full-width  class="overflow-visible" @hide="currentSkill = false">
      <q-card :class="`skill-card ${(currentSkill.is_gained) ? 'is_gained' : (currentSkill.is_available) ? (currentSkill.is_purchasable) ? 'is_purchasable is_available' : 'is_available' : 'is_blocked'} text-center q-pb-sm`">
        <div class="q-pa-sm" style="background: center / contain no-repeat url('/images/rays.png');">
          <q-img width="150px" :src="`${currentSkill.image}?w=150&h=150`" no-spinner/>
        </div>

        <q-card-section class="q-pt-none">
          <div class="text-h6"><b>{{ currentSkill.title }}</b></div>
          <div class="text-caption">{{ currentSkill.description }}</div>
        </q-card-section>
        <q-separator/>
        <q-card-actions >
          <div v-if="currentSkill.is_available" class="full-width">
            <div v-if="currentSkill.cost.length > 0" class="q-pa-sm bg-grey-3 rounded-sm">
              <div class="text-center text-subtitle1"><b>Необходимо: </b></div>
              <div class="row justify-center q-gutter-sm q-py-sm">
                <div v-for="(resource, resourceIndex) in currentSkill.cost" :key="resourceIndex" >
                  <UserResourceBar :resource="resource" dense no-caption size="26px" push/>
                </div>
              </div>
            </div>
            <q-btn v-if="currentSkill.price > 0" push class="bg-gradient-primary-purple-to-right text-white full-width text-bold q-mt-sm q-item-blinking " @click="openPayment(currentSkill.id)"  @click.stop="playAudio('click')">{{ currentSkill.price }}₽</q-btn>
            <q-btn v-else-if="currentSkill.is_purchasable" push color="primary" class="full-width text-bold q-mt-sm q-item-blinking" icon="file_upload" label="Исследовать" @click="claimSkill(currentSkill.id)" @click.stop="playAudio('gain')"  :loading="isLoading"/>
            <q-btn v-else color="positive" push class="full-width text-bold q-mt-sm" icon="add" label="Докупить ресурсы" @click="openMarket()"  @click.stop="playAudio('click')"/>
          </div>
          <div v-if="currentSkill.is_gained" class="full-width">
            <q-btn color="white" icon="check" flat class="full-width text-bold" label="Исследовано"/>
          </div>
          <div v-if="!currentSkill.is_gained && !currentSkill.is_available" class="full-width">
            <div class="text-subtitle1"><b>Сначала изучите: </b></div>
            <q-list class="text-left">
              <q-item  clickable  v-for="(requiredSkill, requiredSkillIndex) in currentSkill.required_skills" :key="requiredSkillIndex"  @click="openModal(requiredSkill)"  @click.stop="playAudio('click')">
                <q-item-section avatar>
                  <q-avatar size="50px" text-color="white">
                    <img class="absolute" :src="requiredSkill.image" />
                  </q-avatar>
                </q-item-section>
                <q-item-section class="q-pl-sm">
                  <q-item-label lines="1"><b>{{ requiredSkill.title }}</b></q-item-label>
                  <q-item-label caption>{{ requiredSkill.description }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn size="12px" flat dense round icon="chevron_right" />
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-actions>
        <PaymentWidget
            :isOpen="buyDialog"
            :itemId="currentSkill.id*1"
            itemCode="skill"
            returnUrl="skills"
            @onHide="buyDialog = false"
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
import UserInvitaionWidget from '../components/UserInvitaionWidget.vue'
import PaymentWidget from '../components/PaymentWidget.vue'
import { playAudio } from 'src/services/audioService';
import { useRoute, onBeforeRouteLeave } from 'vue-router'
import PaymentWidget from '../components/PaymentWidget.vue'

const route = useRoute()

const { user, getItem } = useUserStore()

const marketOffers = ref([])
const error = ref(false)
const buyDialog = ref(false)
const activeOffer = ref({})
const confirmationToken = ref(false)
const paymentId = ref(false)
let pollingInterval = null
const inviteDialog = ref(false)


const load = async (filter) => {
  const marketOfferListResponse = await api.market_offer.getList()
  if (marketOfferListResponse.error) {
    error.value = marketOfferListResponse
    marketOffers.value = []
    return []
  }
  marketOffers.value = marketOfferListResponse
}
const openPayment = (offer_id) => {
  activeOffer.value = marketOffers.value.find((offer) => offer.id == offer_id);
  buyDialog.value = true
}
onActivated(async () => {
  load()
})
onMounted(async () => {
  load();
})

</script>
