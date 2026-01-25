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
              <div class="text-h6"><b>Базар</b></div>
              <div class="text-caption">Торговля - двигатель прогресса!</div>
            </div>
          </q-card-section>
      </q-card>
      <q-card flat class="relative text-left q-pt-md rounded-borders rounded-b-0 full-width overflow-hidden" style="flex: 1;">
          <q-card-section class="q-pa-none">

            <MarketOfferList @onAction="handleAction"/>
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
    </q-page>
  </q-page-container>
</template>

<script setup >
import { ref, onActivated, onMounted, onDeactivated, onUnmounted } from 'vue'
import { api } from '../services/index'
import { useUserStore } from '../stores/user'
import UserResourceBar from '../components/UserResourceBar.vue'
import { playAudio } from 'src/services/audioService';
import { useRoute, onBeforeRouteLeave } from 'vue-router'
import MarketOfferList from 'src/components/MarketOfferList.vue'

const route = useRoute()

const { user, getItem } = useUserStore()

const marketOffers = ref([])
const activeOffer = ref({})

const handleAction = async () => {
  await getItem()
}

</script>
