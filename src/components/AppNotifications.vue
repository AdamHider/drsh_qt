<template>
    <div>
      <q-dialog v-model="dialog" seamless position="top">
        <q-card style="width: 350px">
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

const { notifications } = useNotification()

const dialog = ref(false)
const notification = ref({})
const notificationQueue = ref([])
const timer = ref(null)
const timerTotal = ref(5000)
const timerCount = ref(0)
const progress = ref(0)
const progressAnimation = ref(0)

watch(() => notifications.list, () => {
  if(notifications.list.length > 0){
    notificationQueue.value =notifications.list
  }
})
const runTimer = function () {
  progress.value = 0
  timer.value = setInterval(() => {
    if(timerCount.value == timerTotal.value){
      timerCount.value = 0
      clearInterval(timer.value)
      timer.value = null
      dialog.value = false
      notificationQueue.value = [notificationQueue.value[1]];
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
})
</script>
