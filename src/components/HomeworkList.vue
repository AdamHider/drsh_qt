<template>
    <q-infinite-scroll @load="onLoad">
        <template v-slot:loading>
            <div class="row justify-center q-my-md">
            <q-spinner color="primary" name="dots" size="40px" />
            </div>
        </template>
        <q-card  v-for="(homeworkItem, index) in homework.list" :key="index" class="q-ma-sm cursor-pointer"  @click="router.push(`homework-${homeworkItem.id}`)"
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
                    <div class="text-bold">{{homeworkItem.description.title}}</div>
                    <div class="text-caption">{{homeworkItem.description.description}}</div>
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
                        <div class="col-2 self-end text-right">
                            <b>{{homeworkItem.exercise?.data.progress_percentage || 0 }}%</b>
                        </div>
                    </div>
                    <q-linear-progress
                        :color="(homeworkItem.exercise?.data.progress_percentage/100) >= 1 ? 'positive' : 'white'"
                        :value="(homeworkItem.exercise?.data.progress_percentage / 100) || 0"
                        size="12px"
                        rounded
                    ></q-linear-progress>
                </q-item-section>
            </q-item>
            </q-card-section >
        </q-card >
    </q-infinite-scroll>
</template>

<script setup>
import { onActivated } from 'vue'
import { useHomework } from '../composables/useHomework'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const { homework, getList, getListUpdates } = useHomework()

const onLoad = async function (index, done) {
  const isDone = await getList({ page: index, classroom_id: route.params.classroom_id })
  done(isDone)
}
onActivated(() => {
  if (homework.list.length > 0) getListUpdates({ classroom_id: route.params.classroom_id })
})

</script>
