<template>
  <q-infinite-list
    :loadMore="loadMore"
    @onLoaded="onLoaded"
  >
      <q-card  v-for="(classroomItem, index) in classrooms" :key="index" class="q-ma-sm  cursor-pointer"
       >
        <q-card-section  class="q-pt-sm items-center" horizontal>
          <q-item class="full-width q-px-md" :to="`classroom-${classroomItem.id}`">
            <q-item-section avatar>
              <q-avatar size="60px">
                <img :src="classroomItem.image">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <b>{{classroomItem.title}}</b>
              <div v-if="!classroomItem?.is_private" class="text-caption">Open classroom</div>
              <div v-else class="text-caption">Private classroom</div>
            </q-item-section>

            <q-item-section side>
              <q-chip color="primary" text-color="white" icon-right="person">
                <b>{{classroomItem.subscribers_total}}</b>
              </q-chip>
            </q-item-section>
          </q-item>
        </q-card-section>
        <q-separator/>
        <q-card-actions class="q-pb-sm q-px-sm  justify-center row">
            <div v-if="!classroomItem?.is_owner">
              <q-btn v-if="!classroomItem?.is_subscribed && !classroomItem?.is_disabled_subscriber" flat push label="Subscribe" color="primary" icon="person_add" @click="subscribeClassroom(classroomItem.code)"></q-btn>
              <q-btn v-else-if="classroomItem?.is_disabled_subscriber" flat color="green-8" push label="Request sent" icon="check" @click="unsubscribeClassroom(classroomItem.code)"></q-btn>
              <q-btn v-else push flat color="positive" icon="check" label="Subscribed" @click="unsubscribeClassroom(classroomItem.code, classroomItem.is_private)"></q-btn>
            </div>
            <div v-else>
              <q-btn push flat icon="edit"  label="Edit" :to="`/classroom-${classroomItem?.id}/edit`"></q-btn>
            </div>
        </q-card-actions>
      </q-card>
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
        <q-btn flat label="Continue" @click="unsubscribeClassroom(warningDialogCode, 1)" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { api } from '../services/index'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useClassroom } from '../composables/useClassroom'

const router = useRouter()

const { subscribe, unsubscribe } = useClassroom()

const classrooms = ref([])
const error = ref({})
const warningDialog = ref(false)
const warningDialogCode = ref(false)

const loadMore = async function (filter) {
  const classroomListResponse = await api.classroom.getList(filter)
  if (classroomListResponse.error) {
    error.value = classroomListResponse
    return []
  }
  return classroomListResponse
}

const subscribeClassroom = async function (classroom_code, is_private) {
  await subscribe({ classroom_code })
  const classroomListResponse = await api.classroom.getList({ limit: classrooms.value.length })
  if (classroomListResponse.error) {
    error.value = classroomListResponse
    return []
  }
  classrooms.value = classroomListResponse
}
const unsubscribeClassroom = async function (classroom_code, is_private) {
  if (!warningDialog.value && is_private) {
    warningDialog.value = true
    warningDialogCode.value = classroom_code
    return
  }
  warningDialog.value = false
  await unsubscribe({ classroom_code })
  const classroomListResponse = await api.classroom.getList({ limit: classrooms.value.length })
  if (classroomListResponse.error) {
    error.value = classroomListResponse
    return []
  }
  classrooms.value = classroomListResponse
}
const onLoaded = function (response) {
  classrooms.value = response
}

</script>
