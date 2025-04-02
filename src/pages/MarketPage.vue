<template>
  <q-page-container>
    <q-app-header class="transparent text-white rounded-b-md" reveal :showForce="headerShowForce">
      <q-btn flat icon="arrow_back"  @click="$router.go(-1);" v:slot="back-button"/>
      <UserResourceBar v-if="user.active?.data.resources" :resource="user.active?.data.resources.terralit" dense no-caption size="24px" push />
      <UserResourceBar v-if="user.active?.data.resources" :resource="user.active?.data.resources.science" dense no-caption size="24px" push class="q-mx-sm"/>
      <UserResourceBar v-if="user.active?.data.resources" :resource="user.active?.data.resources.isonit" dense no-caption size="24px" push/>
    </q-app-header>
    <q-page class="column justify-center content-start text-center full-width" style="padding-top: 50px;">
      <div class="page-background fixed-top full-width"  style="height: 300px; background-image: url('/images/market/main_background.jpg'); background-size: cover; background-position: bottom;"></div>
      <q-card class="text-center transparent no-shadow full-width justify-center column " style="position: relative;">
          <q-card-section class="text-white text-left flex flex-no-wrap items-center q-pa-none q-pt-md">
            <div class="col">
              <q-img width="200px" src="/images/market/character.png" style="max-width: 100%;"/>
            </div>
            <div class="col q-pa-sm"  style="text-shadow: 2px 2px 5px black;">
              <div class="text-h6"><b>Космо-маркет</b></div>
              <div class="text-caption">Время пополнить запасы!</div>
            </div>
          </q-card-section>
      </q-card>
      <q-card flat class="relative text-left q-pt-md q-pb-md rounded-borders rounded-b-0 full-width" style="flex: 1;">
          <q-card-section>
            <div class="row q-gutter-md q-pb-sm">
              <div class="col">
                <q-card class="text-left q-push text-white" style="background-image: url('/images/market/card_background.jpg'); background-size: cover;">
                  <q-card-section horizontal class="q-pa-sm items-center">
                    <q-img src="/images/market/zumrut_pack2.png" width="50%"  style="margin-top: -50px"/>
                    <q-card-section class="q-pt-none">
                      <div class="text-h6"><b>Премиум!</b></div>
                      <div class="text-caption"><b>Драгоценный бум</b></div>
                    </q-card-section>
                  </q-card-section>
                  <q-card-section class="q-pt-none">
                    <div class="flex q-gutter-sm justify-center">
                      <UserResourceBar :resource="{
                          quantity: 10,
                          image: 'https://cdn-icons-png.flaticon.com/128/4858/4858971.png',
                          color: 'red'
                        }" dense no-caption size="24px" push/>
                      <UserResourceBar :resource="{
                          quantity: 100,
                          image: 'https://cdn-icons-png.flaticon.com/128/4858/4858971.png',
                          color: 'indigo'
                        }" dense no-caption size="24px" push/>
                    </div>
                  </q-card-section>
                  <q-card-actions class="q-pt-none">
                    <q-btn class="full-width q-item-blinking" push color="primary">100$</q-btn>
                  </q-card-actions>
                </q-card>
              </div>
            </div>
            <div class="row q-gutter-md q-py-sm">
              <div class="col">
                <q-card class="text-center">
                  <q-card-section class="q-pa-sm">
                      <q-img src="https://cdn.quasar.dev/img/mountains.jpg"/>
                  </q-card-section>
                  <q-card-section class="q-pa-sm">
                    <div class="text-subtitle2"><b>Our Changing Planet</b></div>
                    <div class="flex q-gutter-sm justify-center">
                      <UserResourceBar :resource="{
                          quantity: 10,
                          image: 'https://cdn-icons-png.flaticon.com/128/4858/4858971.png',
                          color: 'red'
                        }" dense no-caption size="24px" push/>
                    </div>
                  </q-card-section>
                  <q-card-actions class="q-pt-none">
                    <q-btn class="full-width q-item-blinking" push color="primary">100$</q-btn>
                  </q-card-actions>
                </q-card>
              </div>
              <div class="col">
                <q-card class="text-center">
                  <q-card-section class="q-pa-sm">
                      <q-img src="https://cdn.quasar.dev/img/mountains.jpg"/>
                  </q-card-section>
                  <q-card-section class="q-pa-sm">
                    <div class="text-subtitle2"><b>Our Changing Planet</b></div>
                    <div class="flex q-gutter-sm justify-center">
                      <UserResourceBar :resource="{
                          quantity: 10,
                          image: 'https://cdn-icons-png.flaticon.com/128/4858/4858971.png',
                          color: 'red'
                        }" dense no-caption size="24px" push/>
                    </div>
                  </q-card-section>
                  <q-card-actions class="q-pt-none">
                    <q-btn class="full-width q-item-blinking" push color="primary">100$</q-btn>
                  </q-card-actions>
                </q-card>
              </div>
            </div>
          </q-card-section>
      </q-card>
    </q-page>
  </q-page-container>
</template>

<script setup >
import { ref, onActivated, watch } from 'vue'
import { api } from '../services/index'
import { useUserStore } from '../stores/user'
import UserResourceBar from '../components/UserResourceBar.vue'

const { user, getItem } = useUserStore()

const skills = ref([])
const error = ref(false)
const headerShowForce = ref(false)

const load = async function (filter) {
  const skillListResponse = await api.skill.getList({ mode: 'by_user' })
  if (skillListResponse.error) {
    error.value = skillListResponse
    skills.value = []
    return []
  }
  skills.value = skillListResponse
}
const reload = async function () {
  await getItem()
  load()
}
onActivated(() => {
  load()
})
</script>
