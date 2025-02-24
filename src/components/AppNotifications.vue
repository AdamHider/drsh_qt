<template>
    <div>
      <q-dialog v-model="dialog" seamless position="top">
        <q-card style="width: 350px" v-if="notification?.id">
          <q-card-section>
            <q-item :to="notification.link">
              <q-item-section avatar>
                  <q-img :src="notification.image" size="60px"/>
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
          <q-linear-progress :value="progress" color="primary" :animation-speed="progressAnimation" />
        </q-card>
      </q-dialog>

    </div>
</template>

<script setup>
import { useNotification } from '../composables/useNotification'
import { ref, watch } from 'vue'

const { notifications, clearLists } = useNotification()

const dialog = ref(false)
const notification = ref({})
const notificationList = ref([])
const progress = ref(0)
const progressAnimation = ref(0)
const isStarted = ref(false)

const composeList = () => {
  //filterNewNotifications()
  if(notificationList.value.length > 0){
    if(!isStarted.value) showNotification()
  }
}

const filterNewNotifications = () => {
  var found = false
  const allNotifications = [].concat(notifications.achievements.list, notifications.skills.list)
  for(var i in allNotifications){
    found = false
    for(var k in notificationList.value){
      if(notificationList.value[k].id == allNotifications[i].id){
        found = true
      }
    }
    if(!found) notificationList.value.push(allNotifications[i])
    console.log(allNotifications[i])
  }
}

const showNotification = () => {
  isStarted.value = true
  setTimeout(() => {
    dialog.value = true
    notification.value = notificationList.value[0]
  }, 1000)
  setTimeout(() => {
    notificationList.value.shift()
    dialog.value = false
    if(notificationList.value.length > 0) {
        showNotification()
    } else {
      clearLists(['achievements', 'skills'])
      isStarted.value = false
    }
  }, 3000)
}

watch(notifications.achievements, () => {
  notificationList.value.push(notifications.achievements.list)
  composeList()
})

watch(notifications.skills, () => {
  notificationList.value.push(notifications.skills.list)
  composeList()
})
/*
const runTimer = function () {
  progress.value = 0
  timer.value = setInterval(() => {
    if(timerCount.value == timerTotal.value){
      timerCount.value = 0
      clearInterval(timer.value)
      timer.value = null
      dialog.value = false
      notificationQueue.value.shift();
      return false;
    }

    timerCount.value += 50
    progress.value = timerCount.value / timerTotal.value
  }, 50)
}
watch(() => notificationQueue.value, () => {
    console.log(notificationQueue.value)
    notification.value = notificationQueue.value[0].data
    dialog.value = true
    runTimer()
})*/
</script>
