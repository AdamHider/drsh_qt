<template>
    <q-infinite-scroll @load="onClassroomLoad" >
        <template v-slot:loading>
            <div class="row justify-center q-my-md">
            <q-spinner color="primary" name="dots" size="40px" />
            </div>
        </template>
        <q-card  v-for="(classroomItem, index) in classroom.list" :key="index" class="q-ma-sm cursor-pointer"   @click="router.push(`classroom-${classroomItem.id}`)">
            <q-card-section class="text-left q-pa-none relative-position">
                <q-img
                    class="rounded-t"
                    :src="classroomItem.background_image"
                    loading="lazy"
                    spinner-color="white"
                >
                </q-img>
                <div class="absolute-bottom transparent q-pa-none-important text-left">
                  <q-chip
                      v-if="classroomItem.time_left_humanized && !classroomItem.is_finished"
                      dense
                      class="q-ma-sm"
                      style="font-size: 13px"
                      :color="((classroomItem.time_left <= 3) ? 'red' : 'orange')"
                      icon="sports_score"
                      text-color="white">
                      <b>{{ classroomItem.time_left_humanized }}</b>
                  </q-chip>
                  <q-chip
                      v-else-if="!classroomItem.is_finished"
                      dense
                      class="q-ma-sm"
                      style="font-size: 13px"
                      :color="'red'"
                      icon="sports_score"
                      text-color="white">
                      <b>Hurry up!</b>
                  </q-chip>
                  <q-chip
                      v-if="classroomItem.is_finished"
                      dense
                      class="q-ma-sm"
                      style="font-size: 13px"
                      icon="check"
                      color="positive"
                      text-color="white">
                      <b>Done</b>
                  </q-chip>
                </div>
                <div class="absolute-bottom transparent q-pa-none-important text-right">
                  <q-chip
                      v-if="classroomItem.value"
                      dense
                      class="q-ma-sm"
                      style="font-size: 13px"
                      icon="ads_click"
                      icon-right="star"
                      color="primary"
                      text-color="white">
                      <b>{{ classroomItem.value }}</b>
                  </q-chip>
                </div>
            </q-card-section >
            <q-card-section  class="text-left">
                <div class="text-bold max-two-lines">{{classroomItem.title}}</div>
                <div class="text-caption text-grey max-one-lines" v-if="classroomItem.winner_left && classroomItem.winner_left > 0">Winners left: {{classroomItem.winner_left}}</div>
            </q-card-section>
        </q-card >
    </q-infinite-scroll>
</template>

<script setup>
import { onActivated } from 'vue'
import { useRouter } from 'vue-router'
import { useClassroom } from '../composables/useClassroom'

const router = useRouter()
const { classroom, getList, getListUpdates } = useClassroom()

const onClassroomLoad = async function (index, done) {
  console.log(done)
  const isDone = await getList({ page: index })
  done(isDone)
}
onActivated(() => {
  if (classroom.list.length > 0) getListUpdates()
})

</script>
