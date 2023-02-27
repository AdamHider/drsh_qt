<template>
    <q-infinite-scroll ref="infiniteScroll" @load="onLoad">
        <template v-slot:loading>
            <div class="row justify-center q-my-md">
            <q-spinner color="primary" name="dots" size="40px" />
            </div>
        </template>
        <q-card  v-for="(achievementItem, index) in achievements" :key="index" class="q-ma-sm">
            <q-card-section >
            <q-item class="q-pa-none bg-white">
                <q-item-section avatar>
                    <q-avatar size="80px">
                        <q-img
                          :src="achievementItem.image"
                          loading="lazy"
                          spinner-color="white"/>
                    </q-avatar>
                </q-item-section>
                <q-item-section class="text-left">
                    <div class="text-bold">{{achievementItem.title}}</div>
                    <div class="text-grey">{{achievementItem.description}}</div>
                    <div class="row q-ma-sm">
                        <div class="col text-left"></div>
                        <div class="col text-right">
                            <b>{{achievementItem.progress.current}}/{{achievementItem.progress.target}}</b>
                        </div>
                    </div>
                    <q-linear-progress
                        :color="(achievementItem.progress.percentage/100) >= 1 ? 'positive' : 'primary'"
                        :value="(achievementItem.progress.percentage/100)"
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
import { api } from '../services/index'
import { ref, onActivated, onDeactivated } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

const infiniteScroll = ref()
const achievements = ref([])
const limit = 8

const onLoad = async function (index, done) {
  let offset = 0
  if (achievements.value.length > 0) offset = limit * index
  const achievementListResponse = await api.achievement.getList({ mode: 'all', limit, offset })
  if (!achievementListResponse.error) {
    achievements.value = achievements.value.concat(achievementListResponse)
    done(achievementListResponse.length === 0)
  } else {
    done(true)
  }
}
onActivated(() => {
  infiniteScroll.value.resume()
})
onDeactivated(() => {
  infiniteScroll.value.stop()
})
// onActivated(() => {
// console.log('empty');
// getList();
// });

</script>
