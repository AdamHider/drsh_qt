<template>
    <q-page-container>
        <q-page class="flex justify-center items-end  full-width text-center">
          <q-card flat class="bg-transparent text-white">
              <q-card-section v-if="user.active?.data.id">
                  <h4 class="text-h6">Привет, <b>{{user.active?.data.name}}</b>!</h4>
                  <div class="text-caption">Это пригласительная ссылка. Она работает только для новых героев.</div>
                  <q-btn class=" q-mt-sm full-width" push @click="createNewHero()" color="primary">Создать новго героя</q-btn>
                  <q-btn class="q-mt-sm q-mb-xl full-width" push color="secondary" to="/user"><b>Назад к моему герою</b></q-btn>
              </q-card-section>
          </q-card>
        </q-page>
    </q-page-container>
</template>

<script setup>
import { ref, watch, onActivated, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const { user, signOut } = useUserStore()


const createNewHero = async () => {
  await signOut()
  router.push(`/authorization/sign-up-${route.params.inviter_hash}`)
}
</script>
<style scoped>
.q-page{
  background-image: url('/images/splash.jpg');
  background-size: cover;
  background-position: center center;
}
</style>
