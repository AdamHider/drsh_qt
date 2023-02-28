<template>
  <q-infinite-list
    :loadMore="loadMore"
    @onLoaded="onLoaded"
  >
    <q-card  v-for="(homeworkItem, index) in homeworks" :key="index" class="q-ma-sm cursor-pointer"  @click="router.push(`homework-${homeworkItem.id}`)"
    :style="`background: ${homeworkItem.course_section.background_gradient}; transform: none`">
        <q-card-section >
        <q-img
        :src="homeworkItem.course_section.background_image"
        class="absolute-top absolute-left full-width full-height"
        loading="lazy"
        spinner-color="white"
        />
        <q-item class="q-pa-none">
            <q-item-section avatar>
                <q-avatar size="80px">
                    <q-img
                      :src="homeworkItem.image"
                      loading="lazy"
                      spinner-color="white"/>
                </q-avatar>
            </q-item-section>
            <q-item-section class="text-left text-white">
                <div class="text-bold">{{homeworkItem.title}}</div>
                <div class="text-caption">{{homeworkItem.description}}</div>
                <div class="row q-my-sm" >
                    <div class="col-10 text-left">
                        <q-chip
                            v-if="homeworkItem.time_left_humanized"
                            dense
                            class="q-px-sm q-ma-none"
                            style="font-size: 13px"
                            :color="((homeworkItem.time_left <= 3) ? 'red' : 'orange')"
                            icon="sports_score"
                            text-color="white">
                            <b>{{ homeworkItem.time_left_humanized }}</b>
                        </q-chip>
                    </div>
                    <div v-if="homeworkItem.time_left > 0"
                        class="col-2 self-end text-right">
                        <b>{{homeworkItem.exercise?.data.progress_percentage || 0 }}%</b>
                    </div>
                </div>
                <q-linear-progress
                    v-if="homeworkItem.time_left > 0"
                    :color="(homeworkItem.exercise?.data.progress_percentage/100) >= 1 ? 'positive' : 'white'"
                    :value="(homeworkItem.exercise?.data.progress_percentage / 100) || 0"
                    size="12px"
                    rounded
                ></q-linear-progress>
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

const homeworks = ref([])
const error = ref({})

const props = defineProps({
  classroomId: String,
  mode: String
})

const loadMore = async function (filter) {
  const homeworkListResponse = await api.homework.getList({ ...filter, ...{ classroom_id: props.classroomId, mode: props.mode } })
  if (homeworkListResponse.error) {
    error.value = homeworkListResponse
    return []
  }
  return homeworkListResponse
}
const onLoaded = function (response) {
  homeworks.value = response
}

</script>
