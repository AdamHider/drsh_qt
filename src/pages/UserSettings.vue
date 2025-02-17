<template>
  <q-page-container>
    <q-app-header class="bg-white rounded-b-md " reveal>
        <q-btn flat icon="arrow_back"  @click="$router.go(-1);" v:slot="back-button"/>
        <q-toolbar-title>Настройки</q-toolbar-title>
    </q-app-header>
    <q-page class="bg-white q-pa-sm" style="padding-top: 50px">
      <q-card flat>
        <q-card-section>
            <q-item class="q-pa-none">
                <q-item-section avatar>
                  <q-avatar>
                    <img :src="user.active.data?.character?.image"/>
                  </q-avatar>
                </q-item-section>
                <q-item-section class="text-left">
                    <div class="text-h5"><b>{{user.active.data.username}}</b></div>
                </q-item-section>
                <q-item-section side>
                    <q-btn flat to="/user/edit" icon="edit"/>
                </q-item-section>
            </q-item>
        </q-card-section>
        <q-card-section>
            <q-btn
                class="full-width"
                @click="exitUser();"
                icon="logout"
                label="Выйти"
                push color="dark"
            />
        </q-card-section>
      </q-card>
    </q-page>
  </q-page-container>
</template>

<script setup >
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'

const { user, signOut } = useUserStore()
const router = useRouter()

const exitUser = async function () {
  await signOut()
  return router.push('/authorization')
}
</script>
