<template>
  <q-infinite-list
    :loadMore="loadMore"
    @onLoaded="onLoaded"
  >
    <q-card  v-for="(questItem, index) in quests" :key="index" class="q-ma-sm cursor-pointer"   @click="router.push(`/quest-${questItem.id}`)">
      <q-card-section class="q-py-sm bg-primary text-white">
        <div class="text-bold">{{questItem.title}}</div>
      </q-card-section>
      <q-card-section >
        <q-item class="q-pa-none">
            <q-item-section avatar>
                <q-avatar size="80px">
                    <q-img
                      :src="questItem.image"
                      loading="lazy"
                      spinner-color="white"/>
                </q-avatar>
            </q-item-section>
            <q-item-section class="text-left">
                <q-item-section class="text-left">
                    <q-item-label>{{ questItem.goal.title }}</q-item-label>
                    <q-item-label caption lines="2">{{ questItem.goal.description }}</q-item-label>
                    <div class="row q-my-sm" >
                        <div class="col text-left">
                          <q-chip
                                v-if="questItem.time_left_humanized"
                                dense
                                class="q-px-sm q-ma-none"
                                style="font-size: 13px"
                                :color="((questItem.time_left <= 3) ? 'red' : 'orange')"
                                icon="sports_score"
                                text-color="white">
                                <b>{{ questItem.time_left_humanized }}</b>
                            </q-chip>
                        </div>
                        <div class="col text-right" v-if="questItem.time_left > 0">
                            <b>{{questItem.progress.percentage_text}}</b>
                        </div>
                    </div>
                    <q-linear-progress
                        v-if="questItem.time_left > 0"
                        :color="(questItem.progress.percentage/100) >= 1 ? 'positive' : 'primary'"
                        :value="(questItem.progress.percentage/100)"
                        size="12px"
                        rounded
                    ></q-linear-progress>
                </q-item-section>
            </q-item-section>
        </q-item>
        </q-card-section >
    </q-card >
  </q-infinite-list>
</template>

<script setup>
import { api } from '../services/index'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const quests = ref([])
const error = ref({})

const props = defineProps({
  classroomId: String,
  mode: String
})

const loadMore = async function (filter) {
  const questListResponse = await api.quest.getList({ ...filter, ...{ classroom_id: props.classroomId, mode: props.mode } })
  if (questListResponse.error) {
    error.value = questListResponse
    return []
  }
  return questListResponse
}
const onLoaded = function (response) {
  quests.value = response
}

</script>
