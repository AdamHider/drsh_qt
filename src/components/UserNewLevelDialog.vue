<template>
    <div>
      <q-dialog v-model="dialog" maximized @hide="onClose">
        <q-card style="width: 350px" >
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
  if(notifications.levels.list.length > 0){
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
    clearLists(['levels'])
  }
}

watch(notifications.levels, () => {
  notificationList.value.push(notifications.levels.list)
  composeList()
})
</script>
