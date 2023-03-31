<template>
  <q-infinite-list
    :loadMore="loadMore"
    @onLoaded="onLoaded"
    :reset="reset"
  >
        <q-list separator>
        <q-item v-for="(subscriberItem, index) in subscribers" :key="index" class="q-ma-sm">
            <q-item-section avatar>
              <q-avatar size="50px">
                  <q-img
                      :src="subscriberItem.avatar"
                      loading="lazy"
                      spinner-color="white"/>
              </q-avatar>
            </q-item-section>
            <q-item-section class="text-left">
                <div class="text-bold">{{subscriberItem.username}}</div>
                <div v-if="subscriberItem.is_classroom_owner" class="text-caption">Owner</div>
            </q-item-section>
            <q-item-section side v-if="subscriberItem.is_classroom_owner && !subscriberItem.is_owner">
                <q-btn v-if="subscriberItem.is_classroom_owner && subscriberItem.disabled_subscriber"  push flat icon="check"
                  @click="subscribeClassroom(subscriberItem.classroom_code, subscriberItem.user_id)"></q-btn>
                <q-btn  v-if="(subscriberItem.is_owner || subscriberItem.is_classroom_owner)" push flat icon="close"
                  @click="unsubscribeClassroom(subscriberItem.classroom_code, subscriberItem.user_id)"></q-btn>
            </q-item-section>
        </q-item>
    </q-list>
  </q-infinite-list>
    <q-dialog v-model="warningDialog"  transition-show="scale" transition-hide="scale">
      <q-card class="bg-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">Close lesson</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          Are you sure? You can back to it whenever you want though
        </q-card-section>
        <q-card-actions align="center" class="bg-white text-teal">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn flat label="Continue" @click="unsubscribeClassroom(warningDialogCode, warningDialogUserId, 1)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script setup>
import { api } from '../services/index'
import { ref, onMounted, onActivated, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const subscribers = ref([])
const error = ref({})
const reset = ref(false)
const warningDialog = ref(false)
const warningDialogCode = ref(false)
const warningDialogUserId = ref(false)

const loadMore = async function (filter) {
  const subscriberListResponse = await api.classroom.getSubscriberList({ ...filter, ...{ classroom_id: route.params.classroom_id } })
  if (subscriberListResponse.error) {
    error.value = subscriberListResponse
    return []
  }
  return subscriberListResponse
}
const onLoaded = function (response) {
  subscribers.value = response
  reset.value = false
}
const subscribeClassroom = async function (classroom_code, user_id) {
  await api.classroom.subscribe({ classroom_code, user_id })
  const subscriberListResponse = await api.classroom.getSubscriberList({ limit: subscribers.value.length, classroom_id: route.params.classroom_id })
  if (subscriberListResponse.error) {
    error.value = subscriberListResponse
    return []
  }
  subscribers.value = subscriberListResponse
}
const unsubscribeClassroom = async function (classroom_code, user_id, confirm) {
  if (!warningDialog.value && !confirm) {
    warningDialog.value = true
    warningDialogCode.value = classroom_code
    warningDialogUserId.value = user_id
    return
  }
  warningDialog.value = false
  await api.classroom.unsubscribe({ classroom_code, user_id })
  const subscriberListResponse = await api.classroom.getSubscriberList({ limit: subscribers.value.length, classroom_id: route.params.classroom_id })
  if (subscriberListResponse.error) {
    error.value = subscriberListResponse
    return []
  }
  subscribers.value = subscriberListResponse
}

watch(() => route.params.classroom_id, (newData, oldData) => {
  reset.value = true
})
</script>
