<template>
    <q-infinite-scroll @load="onLoad">
        <template v-slot:loading>
            <div class="row justify-center q-my-md">
            <q-spinner color="primary" name="dots" size="40px" />
            </div>
        </template>
        <q-list separator>
        <q-item v-for="(subscriberItem, index) in classroom.subscriber.list" :key="index" class="q-ma-sm">
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
    </q-infinite-scroll>
</template>

<script setup>
import { onActivated, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useClassroom } from '../composables/useClassroom'

const router = useRouter()
const route = useRoute()
const { classroom, getSubscriberList, getSubscriberListUpdates } = useClassroom()

const onLoad = async function (index, done) {
  const isDone = await getSubscriberList({ page: index, classroom_id: route.params.classroom_id })
  done(isDone)
}
onActivated(() => {
  if (classroom.subscriber.list.length > 0) getSubscriberListUpdates({ classroom_id: route.params.classroom_id })
})

</script>
