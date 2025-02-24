<template>
    <div>
      <q-dialog v-model="dialog" maximized @hide="onClose" transition-show="slide-up" transition-hide="slide-down">
        <AppBackground/>
        <q-card class="column justify-center text-center bg-transparent text-white">
          <q-img :src="notification.image" width="150px" class="self-center"/>
          <q-card-section>
            <div class="text-h6"><b>{{ notification.title }}</b></div>
            <div class="text-subtitle2"><b>{{ notification.description }}</b></div>
          </q-card-section>
          <q-card-actions class="justify-center">
            <q-btn flat color="white" v-close-popup><b>Нажмите, чтобы продолжить</b></q-btn>
          </q-card-actions>

        </q-card>
      </q-dialog>

    </div>
</template>

<script setup>
import AppBackground from 'components/AppBackground.vue'
import { useNotification } from '../composables/useNotification'
import { ref, watch } from 'vue'

const { notifications } = useNotification()

const dialog = ref(false)
const notification = ref({})
const notificationList = ref([])

const composeList = () => {
  if(notificationList.value.length > 0){
    showNotification()
  }
}

const showNotification = () => {
  dialog.value = true
  notification.value = notificationList.value[0]
}

const onClose = () => {
  notificationList.value.shift()
  dialog.value = false
  if(notificationList.value.length > 0) {
      showNotification()
  } else {
    notification.value = {}
  }
}

watch(() => notifications.value.level, () => {
  notificationList.value.push(notifications.value.level)
  composeList()
})
</script>
