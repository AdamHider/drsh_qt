<template>
    <q-page-container>
        <q-page class="flex justify-center items-end  full-width text-center" style="">
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
          </q-card>
        </q-page>
    </q-page-container>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'

const router = useRouter()

const { user } = useUserStore()

watch(() => user, (newValue, oldValue) => {
  if (newValue.id) return router.push('/user')
})
</script>
<style scoped>
.q-page{
  background-image: url('/images/splash.jpg');
  background-size: cover;
  background-position: center center;
}
</style>
