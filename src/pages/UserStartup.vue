<template>
    <q-page-container>
        <q-page :class="`flex justify-center items-end  full-width text-center ${(tapped) ? 'zoomed' : ''}`">
          <q-card flat class="bg-transparent text-white">
              <q-card-section v-if="user.active?.data.id" class="d-flex flex-no-wrap justify-space-between align-center">
                  <h4 class="text-h6">{{user.active?.data.name}}</h4>
                  <q-btn push  @click="signOut()" color="white" @click.stop="playAudio('click')">Выйти</q-btn>
              </q-card-section>
              <div v-if="!tapped">
                  <div class="tap-overlay" @click="tapped = true" @click.stop="playAudio('click')"></div>
                  <q-btn flat class="full-width q-ma-sm q-mb-xl animation-flash" @click="tapped = true" @click.stop="playAudio('click')"><b>Нажмите, чтобы продолжить</b></q-btn>
              </div>
              <div v-else>
                <transition
                  appear
                  enter-active-class="animated fadeIn"
                  leave-active-class="animated fadeOut" >
                  <q-card-section class="q-pb-xl">
                    <div style="max-width: 200px;">
                      <q-btn push color="primary" @click="openUserSelection()" class="full-width q-my-sm" @click.stop="playAudio('click')">Продолжить</q-btn>
                      <q-btn push color="secondary" @click="openSignUp()"  class="full-width  q-my-sm" @click.stop="playAudio('click')">Новая игра</q-btn>
                      <q-btn push color="primary" @click="closeDialog = true;" class="q-my-sm" @click.stop="playAudio('click')">Выйти из игры</q-btn>
                    </div>
                  </q-card-section>
                </transition>
              </div>
          </q-card>
          <q-dialog v-model="closeDialog"  transition-show="scale" transition-hide="scale">
            <q-card class="bg-white" style="width: 300px">
              <q-card-section>
                <div class="text-h6"><b>Выйти из игры</b></div>
              </q-card-section>
              <q-card-section class="q-pt-none">
                Можно вернуться в любое время.
              </q-card-section>
              <q-card-actions align="center" class="bg-white text-teal">
                <q-btn flat class="col" color="grey" v-close-popup @click.stop="playAudio('click')"><b>Отмена</b></q-btn>
                <q-btn push class="col" color="primary" label="Выйти" @click="closeApp" @click.stop="playAudio('click')"/>
              </q-card-actions>
            </q-card>
          </q-dialog>
          <q-dialog v-model="userListDialog"  transition-show="scale" transition-hide="scale" :persistend="isLoading">
            <q-card class="bg-white" style="width: 300px">
              <q-card-section>
                <div class="text-h6"><b>Выбери героя</b></div>
              </q-card-section>
              <q-card-section class="q-pt-none q-px-none">
                <q-list separator>
                  <q-item v-for="(userItem, userId) in userList" :key="`userItem${userId}`" clickable v-ripple @click="selectUser(userItem)">
                    <q-item-section avatar>
                      <div class="q-gutter-sm">
                        <q-avatar size="40px">
                            <img :src="userItem.data?.character?.image">
                        </q-avatar>
                      </div>
                    </q-item-section>
                    <q-item-section>
                      <div><b>{{ userItem.data?.name }}</b></div>
                      <div class="text-caption">Уровень {{ userItem.data?.level?.level }}</div>
                    </q-item-section>
                    <q-item-section side>
                      <q-spinner-puff  v-if="isLoading" />
                      <q-icon v-else name="chevron_right" />
                    </q-item-section>
                  </q-item>
                  <q-item clickable @click="openSignIn()" v-ripple>
                    <q-item-section avatar>
                      <div class="q-gutter-sm">
                        <q-avatar size="40px" icon="add" color="primary" text-color="white" ></q-avatar>
                      </div>
                    </q-item-section>
                    <q-item-section>
                      <div><b>Другой герой</b></div>
                      <div class="text-caption">Добавить другого героя</div>
                    </q-item-section>
                    <q-item-section side>
                      <q-icon name="chevron_right" />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
              <q-card-actions align="center" class="bg-white text-teal">
                <q-btn flat class="col" color="grey" :disabled="isLoading" v-close-popup @click.stop="playAudio('click')"><b>Отмена</b></q-btn>
              </q-card-actions>
            </q-card>
          </q-dialog>
        </q-page>
    </q-page-container>
</template>

<script setup>
import { ref, watch, computed, onActivated, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { playAudio } from 'src/services/audioService';
import { useQuasar } from 'quasar'

const router = useRouter()

const { user, signIn } = useUserStore()
const $q = useQuasar()

const tapped = ref(false)
const closeDialog = ref(false)
const closeConfirmed = ref(false)
const userListDialog = ref(false)
const isLoading = ref(false)

const userList = computed(() => {
  var result = [];
  const user_ids = Object.keys(user.list);
  for(var i in user_ids){
    if(user.list[user_ids[i]].authorization) result.push(user.list[user_ids[i]])
  }
  return result
})

onActivated(() => {
  if (user.id) return router.push('/user')
})
onMounted(() => {
  if (user.id) return router.push('/user')
})
const closeApp = () => {
  closeConfirmed.value = true
  window.close();
}
const openUserSelection = () => {
  if(Object.keys(user.list).length > 0){
    userListDialog.value = true
  } else {
    closeConfirmed.value = true
    return router.push('/authorization/sign-in')
  }
}
const selectUser = async (user) => {
  isLoading.value = true
  const sign = await signIn(user.authorization)
  if(sign){
    router.push('/user')
  } else {
    $q.notify({
      message: 'Не удаётся выбрать героя. Попробуй добавить выбранного героя как нового.',
      type: 'negative'
    })
  }
  isLoading.value = false
}
const openSignIn = () => {
  userListDialog.value = false
  closeConfirmed.value = true
  return router.push('/authorization/sign-in')
}
const openSignUp = () => {
  closeConfirmed.value = true
  return router.push('/authorization/sign-up')
}
watch(() => user.active.data.id, (newValue, oldValue) => {
  if (user.active.data.id) return router.push('/user')
})
onBeforeRouteLeave((to, from) => {
  if (!closeConfirmed.value && to.fullPath !== '/user') {
    closeDialog.value = true
    return false
  }
  if(userListDialog.value){
    userListDialog.value = false
    return false
  }
  closeDialog.value = false
  return true
})
</script>
<style scoped>
.q-page{
  background-image: url('/images/splash_mobile.jpg');
  background-size: auto 100%;
  background-position: center center;
  transition: 0.3s all ease;
}
.desktop .q-page{
  background-image: url('/images/splash_desktop.jpg');
  background-size: auto 100%;
}
.q-page.zoomed{
  background-size: auto 110%;
}
.tap-overlay{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.animation-flash{
  animation: flash 2s ease infinite alternate;
}
@keyframes shake {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
