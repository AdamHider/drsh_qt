<template>
    <q-infinite-list
      :loadMore="loadMore"
      @onLoaded="onLoaded"
    >
        <q-card  v-for="(classroomItem, index) in classrooms" :key="index" class="q-ma-sm cursor-pointer"  >
          <q-card-section  class="q-pa-none items-center" horizontal>
            <q-card-section  class="q-pa-sm"  @click="router.push(`classroom-${classroomItem.id}`)">
              <q-img
                  :src="classroomItem.image"
                  loading="lazy"
                  width="100px"
                  height="100px"
                  spinner-color="white"
              >
              </q-img>
            </q-card-section>
            <q-separator vertical/>
            <q-card-section class="col text-left full-width q-pa-sm" >
              <q-card-section class="q-pa-sm"  @click="router.push(`classroom-${classroomItem.id}`)">
                <div class="text-bold max-two-lines">{{classroomItem.title}}</div>
                <div class="text-caption max-two-lines">{{classroomItem.description}}</div>
                <div v-if="!classroomItem?.is_private" class="text-caption">Open classroom</div>
                <div v-else class="text-caption">Private classroom</div>
                <div class="text-caption max-two-lines">{{classroomItem.subscribers_total}} subscribers</div>
              </q-card-section>
              <q-separator/>
              <q-card-actions class="q-pa-sm justify-end row">
                  <div v-if="!classroomItem?.is_owner">
                    <q-btn v-if="!classroomItem?.is_subscribed && !classroomItem?.is_disabled_subscriber" push label="Subscribe" color="primary" icon="person_add" @click="subscribeClassroom(classroomItem.code)"></q-btn>
                    <q-btn v-else-if="classroomItem?.is_disabled_subscriber" push label="Request sent" icon="person_add" @click="unsubscribeClassroom(classroomItem.code)"></q-btn>
                    <q-btn v-else push flat icon="check" label="Subscribed" @click="unsubscribeClassroom(classroomItem.code, classroomItem.is_private)"></q-btn>
                  </div>
                  <div v-else>
                    <q-btn push icon="edit"  label="Edit" :to="`/classroom-${classroomItem?.id}/edit`"></q-btn>
                  </div>
              </q-card-actions>
            </q-card-section>
          </q-card-section>
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
