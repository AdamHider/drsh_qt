<template>
  <q-app-header class=" rounded-b-md" reveal>
      <q-btn flat icon="arrow_back"  @click="$router.go(-1);" v:slot="back-button"/>
    <q-toolbar-title>Task</q-toolbar-title>
  </q-app-header>
  <q-page class="text-center bg-white full-width" style="padding-top: 50px" >
    <transition
            appear
            enter-active-class="animated zoomIn animation-slow"
            leave-active-class="animated rubberBand  animation-delay-1" >
      <q-card v-if="transitionTrigger"
          class="transparent no-shadow full-width q-pa-md"
          style="position: relative; z-index: 1;"
        >
            <q-img
                :src="challenge.active?.image"
                no-spinner
            />
      </q-card>
    </transition>
    <transition
      appear
      enter-active-class="animated zoomIn animation-delay-1"
      leave-active-class="animated zoomOut">
    <q-card flat class="relative text-left transparent full-width " style="z-index: 1;"
      v-if="transitionTrigger">
        <q-card-section>
            <div class="text-h5"><b>{{challenge.active?.title}}</b></div>
            <div class="text-caption">{{challenge.active?.description}}</div>
        </q-card-section>

    </q-card>
    </transition>
      <q-card flat class="relative text-left transparent full-width " style="z-index: 1;"
        v-if="transitionTrigger">
        <q-card-section class="q-py-sm">
          <q-list separator>
            <q-item class="q-px-none">
              <q-item-section top avatar>
                <q-avatar color="primary" text-color="white" icon="ads_click" />
              </q-item-section>
              <q-item-section  v-if="challenge.active?.code == 'total_points'">
                <q-item-label>Gain points</q-item-label>
                <q-item-label caption lines="2">Just complete lessons and gain stars.</q-item-label>
              </q-item-section>
              <q-item-section  v-else-if="challenge.active?.code == 'total_points_first'">
                <q-item-label>Gain points as soon as you can</q-item-label>
                <q-item-label caption lines="2">Hurry up. Other participants can make it faster and win.</q-item-label>
              </q-item-section>
              <q-item-section side class="text-dark">
                <b style="font-size: 16px">{{challenge.active?.value}} points</b>
              </q-item-section>
            </q-item>

            <q-item class="q-px-none">
              <q-item-section top avatar>
                <q-avatar color="primary" text-color="white" icon="timeline" />
              </q-item-section>
                <q-item-section >
                  <q-item-label>Current progress</q-item-label>
                <q-item-label caption lines="2">How close to the edge you are.</q-item-label>
              </q-item-section>
              <q-item-section side class="text-dark">
                <b style="font-size: 16px">{{challenge.active?.progress.percentage || 0 }}%</b>
              </q-item-section>
            </q-item>
            <q-item class="q-px-none" v-if="challenge.active?.winner_left > 0">
              <q-item-section top avatar>
                <q-avatar color="primary" text-color="white" icon="people" />
              </q-item-section>
                <q-item-section >
                  <q-item-label>Winners left</q-item-label>
                <q-item-label caption lines="2">How much winners are left.</q-item-label>
              </q-item-section>
              <q-item-section side class="text-dark">
                <b style="font-size: 16px">{{challenge.active?.winner_left }}</b>
              </q-item-section>
            </q-item>
            <q-item  v-if="challenge.active?.date_start_humanized"  class="q-px-none">
              <q-item-section top avatar>
                <q-avatar color="primary" text-color="white" icon="outlined_flag" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Start date</q-item-label>
                <q-item-label caption lines="2">The date challenge starts.</q-item-label>
              </q-item-section>
              <q-item-section side class="text-dark">
                <b style="font-size: 16px">{{challenge.active?.date_start_humanized}}</b>
              </q-item-section>
            </q-item>
            <q-item  v-if="challenge.active?.date_end_humanized && !challenge.active?.is_finished"  class="q-px-none">
              <q-item-section top avatar>
                <q-avatar color="primary" text-color="white" icon="flag" />
              </q-item-section>
              <q-item-section>
                <q-item-label>End date</q-item-label>
                <q-item-label caption lines="2">The date challenge finishes.</q-item-label>
              </q-item-section>
              <q-item-section side class="text-dark">
                <b style="font-size: 16px">{{challenge.active?.date_end_humanized}}</b>
              </q-item-section>
            </q-item>
            <q-item  v-if="challenge.active?.is_finished"  class="q-px-none">
              <q-item-section top avatar>
                <q-avatar color="primary" text-color="white" icon="flag" />
              </q-item-section>
              <q-item-section>
                <q-item-label>This challenge is finished</q-item-label>
              </q-item-section>
              <q-item-section side class="text-dark">
                <b style="font-size: 16px">{{challenge.active?.date_end_humanized}}</b>
              </q-item-section>
            </q-item>
            <q-item  v-if="challenge.active?.is_finished && challenge.active?.is_winner"  class="q-px-none">
              <q-item-section top avatar>
                <q-avatar color="positive" text-color="white" icon="emoji_events" />
              </q-item-section>
              <q-item-section>
                <q-item-label>You are the winner!</q-item-label>
              </q-item-section>
              <q-item-section side class="text-dark" >
                <q-btn v-if="!challenge.active?.winner_confirmed" icon="check" color="positive" label="Confirm" @click="confirmWinner"/>
                <q-btn v-else icon="check" disabled color="positive" label="Confirmed"/>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-section class="q-py-sm text-left"  v-if="!challenge.active?.is_blocked" >
        </q-card-section>
      </q-card>
    <q-card flat>
      <q-card-section  class="q-pa-none ">
        <LeaderboardTable
          :challenge-id="route.params.challenge_id"
        />
      </q-card-section>
    </q-card>
  </q-page>
    <q-dialog v-model="winnerConfirmDialog"  transition-show="scale" transition-hide="scale">
      <q-card class="bg-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">Confirm your contact info</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form
            ref="form"
            v-model="formData.valid"
            @submit.prevent="validate()"
            autocomplete="off"
            class="full-width"
          >
            <q-input
              v-model="formData.fields.phone.value"
              :rules="formData.fields.phone.rules"
              :error-message="formData.fields.phone.errors"
              :error="formData.fields.phone.errors !== ''"
              mask="+# (###) ### - ## - ##"
              fill-mask
              unmasked-value
              label="Phone"
            ></q-input>
          </q-form>
        </q-card-section>
        <q-card-actions align="center" class="bg-white text-teal">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn flat label="Continue" :loading="savingUser" @click="saveUser" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script setup>
import { useUserStore } from '../stores/user'
import { useChallenge } from '../composables/useChallenge'
import LeaderboardTable from '../components/LeaderboardTable.vue'
import { useRoute } from 'vue-router'
import { ref, reactive, onMounted } from 'vue'

const { user, saveItem } = useUserStore()
const route = useRoute()
const { challenge, getItem, addWinner } = useChallenge()
const transitionTrigger = ref(false)
const winnerConfirmDialog = ref(false)
const savingUser = ref(false)
const form = ref(null)

const formData = reactive({
  valid: true,
  fields: {
    phone: {
      value: user.active.data.phone,
      rules: [
        v => v === '' || (v !== '' && (/\(?([0-9]{4})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/.test(v))) || 'Phone must be valid'
      ],
      errors: '',
      suggestions: []
    }
  }
})
const confirmWinner = async () => {
  if (!user.active?.data.phone) {
    winnerConfirmDialog.value = true
    return
  }
  await addWinner(route.params.challenge_id)
  await getItem(route.params.challenge_id)
}

const saveUser = async () => {
  savingUser.value = true
  formData.valid = await form.value.validate()
  if (formData.valid) {
    const userSavedResponse = await saveItem({ phone: formData.fields.phone.value })
    if (!userSavedResponse.errors) {
      await addWinner(route.params.challenge_id)
      await getItem(route.params.challenge_id)
      savingUser.value = false
      winnerConfirmDialog.value = false
    }
  }
}

onMounted(async () => {
  await getItem(route.params.challenge_id)
  transitionTrigger.value = true
})
</script>
