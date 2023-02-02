<template>
    <q-page class="flex justify-center items-end full-height full-width text-center">
      <q-card class="rounded-b-0 full-width">
        <q-card-section v-if="user.active?.data.id" class="d-flex flex-no-wrap justify-space-between align-center">
            <h4 class="text-h6">{{user.active?.data.name}}</h4>
            <q-btn flat  @click="signOut()" color="white">Sign out</q-btn>
        </q-card-section>
        <q-card-section v-else>
          <div class="text-h6">You are not logged in</div>
          <div class="text-grey">But it's easy to become! Just make a choice</div>
          <q-btn flat  color="primary" to="/authorization/sign-in">sign in</q-btn>
          <b>or</b>
          <q-btn flat  color="primary" to="/authorization/sign-up">sign up</q-btn>
        </q-card-section>
        <q-separator v-if="(Object.keys(user.list).length > 0)" class="q-mx-md"></q-separator>
        <q-card-section  v-if="(Object.keys(user.list).length > 0)">
          <q-btn color="dark" flat @click="dialog=true">Choose existing accounts</q-btn>
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
                                <q-item-label lines="1">{{userItem.data?.name}}</q-item-label>
                                <q-item-label caption>Description</q-item-label>
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
</template>

<script setup>
import { ref, inject } from 'vue'
import { useUserStore } from '../stores/user'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const redirectedFrom = inject('redirectedFrom')

const dialog = ref(false)
const btnLoading = ref([])

const switchUser = async (userItem, key) => {
  btnLoading.value[key] = true
  await signIn(userItem.authorization, userItem.activeClassroom)
  btnLoading.value[key] = false
  dialog.value = false
  if (redirectedFrom) return router.push(redirectedFrom.fullPath)
  return router.push('/user')
}

const { signIn, user } = useUserStore()

</script>
