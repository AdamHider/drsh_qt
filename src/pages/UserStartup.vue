<template>
    <q-page-container>
        <q-page class="flex justify-center items-center  full-width text-center">
          <q-card flat class="bg-transparent text-white">
              <q-card-section v-if="user.active?.data.id" class="d-flex flex-no-wrap justify-space-between align-center">
                  <h4 class="text-h6">{{user.active?.data.name}}</h4>
                  <q-btn push  @click="signOut()" color="white">Sign out</q-btn>
              </q-card-section>
              <q-card-section v-else>
                <div class="text-h6">Mektepium</div>
                <div class="text-grey-5 q-mb-lg">Галактика ждёт тебя</div>
                <q-btn push color="primary" to="/authorization/sign-in" class="full-width q-ma-sm">Продолжить</q-btn>
                <q-btn push color="positive" to="/authorization/sign-up" class="full-width q-ma-sm">Новое приключение</q-btn>
              </q-card-section>
              <q-separator color="white" v-if="(Object.keys(user.list).length > 0)" class="q-mx-md"></q-separator>
              <q-card-section  v-if="(Object.keys(user.list).length > 0)">
                <q-btn color="dark" push @click="dialog=true">Выбрать аккаунт</q-btn>
              </q-card-section>
          </q-card>
          <q-dialog v-model="dialog">
              <q-card style="min-width: 300px">
                  <q-card-section>
                      <div class="text-h6">Choose user</div>
                  </q-card-section>
                      <q-list lines="two">
                          <q-item clickable v-ripple
                              v-for="(userItem, index) in user.list" :key="index">

                              <q-item-section>
                                  <q-item-label lines="1">{{userItem.data?.username}}</q-item-label>
                                  <q-item-label caption><b>Level:</b> {{userItem.data?.level?.level}}</q-item-label>
                              </q-item-section>

                              <q-item-section side>
                                  <q-btn
                                      :disabled="(userItem.data?.id == user.active.data.id)"
                                      flat
                                      :loading="btnLoading[index]"
                                      @click="switchUser(userItem, index)"
                                  >Sign In</q-btn>
                              </q-item-section>
                          </q-item>
                      </q-list>
                  <q-card-actions align="right" class="bg-white text-teal">
                      <q-btn flat label="CLOSE" v-close-popup />
                  </q-card-actions>
              </q-card>
          </q-dialog>
        </q-page>
    </q-page-container>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'

const router = useRouter()

const dialog = ref(false)
const btnLoading = ref([])

const switchUser = async (userItem, key) => {
  btnLoading.value[key] = true
  await signIn(userItem.authorization)
  btnLoading.value[key] = false
  dialog.value = false
  return router.push('/user')
}

const { signIn, user } = useUserStore()

watch(() => user, (newValue, oldValue) => {
  if (newValue.id) return router.push('/user')
})
</script>
