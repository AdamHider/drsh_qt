<template>
    <div>
      <q-dialog v-model="dialog" seamless position="top">
        <div>
          <q-card v-if="notification?.id" class="q-ma-sm" style="max-width: 350px" @click="openNotification(notification.link)">
            <q-card-section>
              <q-item >
                <q-item-section avatar>
                    <q-img :src="notification.image" width="60px"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-subtitle1"><b>{{ notification.title }}</b></q-item-label>
                  <q-item-label class="text-caption"><b>{{ notification.description }}</b></q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="chevron_right"/>
                </q-item-section>
              </q-item>
            </q-card-section>
          </q-card>
        </div>
      </q-dialog>
    </div>
</template>

<script setup>
import { useNotification } from '../composables/useNotification'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const { notifications } = useNotification()
const router = useRouter()

const dialog = ref(false)
const notification = ref({})
const isStarted = ref(false)
const notificationList = ref([])

const composeList = () => {
  if(notificationList.value.length > 0){
    if(!isStarted.value) showNotification()
  }
}
const showNotification = () => {
  isStarted.value = true
  setTimeout(() => {
    dialog.value = true
    notification.value = notificationList.value[0]
  }, 500)
  setTimeout(() => {
    notificationList.value.shift()
    dialog.value = false
    if(notificationList.value.length > 0) {
        showNotification()
    } else {
      isStarted.value = false
    }
  }, 5000)
}

const openNotification = (link) => {
  dialog.value = false
  if(link) router.push(link)
}

watch(() => notifications.value.achievement, () => {
  notificationList.value.push(notifications.value.achievement)
  composeList()
})

watch(() => notifications.value.skill, () => {
  notificationList.value.push(notifications.value.skill)
  composeList()
})
watch(() => notifications.value.quest, () => {
  notificationList.value.push(notifications.value.quest)
  composeList()
})
watch(() => notifications.value.invitation, () => {
  notificationList.value.push(notifications.value.invitation)
  composeList()
})


</script>
