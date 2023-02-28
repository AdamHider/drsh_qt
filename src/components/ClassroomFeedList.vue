<template>
  <q-list>
    <q-infinite-list
      :loadMore="loadMore"
      @onLoaded="onLoaded"
    >
      <q-item v-for="(feedItem, index) in classroomFeeds"
        :key="index" class="cursor-pointer"
        clickable
        @click="router.push(`${feedItem.code}-${feedItem.item_id}`)">
        <q-item-section avatar>
          <q-avatar>
            <img :src="feedItem.classroom_image">
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label><b>{{ feedItem.classroom_title }}</b></q-item-label>
          <q-item-label caption>{{ feedItem.title }}</q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label caption>{{ feedItem.date_start_humanized }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-infinite-list>
  </q-list>
</template>

<script setup>
import { api } from '../services/index'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const classroomFeeds = ref([])
const error = ref({})

const loadMore = async function (filter) {
  const classroomFeedListResponse = await api.classroom.getFeed(filter)
  if (classroomFeedListResponse.error) {
    error.value = classroomFeedListResponse
    return []
  }
  return classroomFeedListResponse
}
const onLoaded = function (response) {
  classroomFeeds.value = response
}

</script>
