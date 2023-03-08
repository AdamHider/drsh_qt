<template>
    <q-infinite-list
      :loadMore="loadMore"
      @onLoaded="onLoaded"
    >
        <q-card  v-for="(classroomItem, index) in classrooms" :key="index" class="q-ma-sm cursor-pointer"   @click="router.push(`classroom-${classroomItem.id}`)">

            <q-item  class="q-pa-none">
            <q-item-section avatar>
              <q-img
                  class="rounded-t"
                  :src="classroomItem.background_image"
                  loading="lazy"
                  width="120px"
                  height="120px"
                  spinner-color="white"
              >
              </q-img>
            </q-item-section>
            <q-item-section class="text-left full-width">
                  <div class="text-bold max-two-lines">{{classroomItem.title}}</div>
              <q-separator/>
                  <div class="text-bold max-two-lines">{{classroomItem.title}}</div>
            </q-item-section>
          </q-item>
        </q-card >
    </q-infinite-list>
</template>

<script setup>
import { api } from '../services/index'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const classrooms = ref([])
const error = ref({})

const loadMore = async function (filter) {
  const classroomListResponse = await api.classroom.getList(filter)
  if (classroomListResponse.error) {
    error.value = classroomListResponse
    return []
  }
  return classroomListResponse
}
const onLoaded = function (response) {
  classrooms.value = response
}

</script>
