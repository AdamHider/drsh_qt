<template>
  <q-infinite-list
    :loadMore="loadMore"
    @onLoaded="onLoaded"
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
            </q-item-section>
        </q-item>
    </q-list>
  </q-infinite-list>
</template>

<script setup>
import { api } from '../services/index'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const subscribers = ref([])
const error = ref({})

const loadMore = async function (filter) {
  const subscriberListResponse = await api.classroom.getSubscriberList({ ...filter, ...{ subscriber_id: route.params.subscriber_id } })
  if (subscriberListResponse.error) {
    error.value = subscriberListResponse
    return []
  }
  return subscriberListResponse
}
const onLoaded = function (response) {
  subscribers.value = response
}

</script>
