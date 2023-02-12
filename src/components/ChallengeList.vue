<template>
    <q-infinite-scroll @load="onLoad">
        <template v-slot:loading>
            <div class="row justify-center q-my-md">
            <q-spinner color="primary" name="dots" size="40px" />
            </div>
        </template>
        <q-card  v-for="(challengeItem, index) in challenge.list" :key="index" class="q-ma-sm">
            <q-card-section class="text-left q-pa-none relative-position">
                <q-img
                    class="rounded-t"
                    :src="challengeItem.image"
                    loading="lazy"
                    spinner-color="white"
                >
                  <div class="absolute-top full-height text-left text-white flex flex-center" v-if="challengeItem.progress.value > 0">
                    <q-circular-progress
                      show-value
                      class="text-white text-bold q-ma-md"
                      :value="challengeItem.progress.percentage"
                      track-color="grey-5"
                      size="60px"
                      color="white"
                    >
                    {{ challengeItem.progress.percentage }}%
                    </q-circular-progress>
                  </div>
                </q-img>
                <div class="absolute-bottom transparent q-pa-none-important text-left">
                  <q-chip
                      v-if="challengeItem.time_left_humanized && !challengeItem.is_finished"
                      dense
                      class="q-ma-sm"
                      style="font-size: 13px"
                      :color="((challengeItem.time_left <= 3) ? 'red' : 'orange')"
                      icon="sports_score"
                      text-color="white">
                      <b>{{ challengeItem.time_left_humanized }}</b>
                  </q-chip>
                  <q-chip
                      v-if="challengeItem.is_finished"
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
                      v-if="challengeItem.value"
                      dense
                      class="q-ma-sm"
                      style="font-size: 13px"
                      icon="ads_click"
                      icon-right="star"
                      color="primary"
                      text-color="white">
                      <b>{{ challengeItem.value }}</b>
                  </q-chip>
                </div>
            </q-card-section >
            <q-card-section  class="text-left q-pa-sm">
                <div class="text-bold max-two-lines">{{challengeItem.description.title}}</div>
                <div class="text-caption text-grey max-two-lines">{{challengeItem.description.description}}</div>
                <div class="text-caption text-grey max-one-lines" v-if="challengeItem.winner_left && challengeItem.winner_left > 0">Winners left: {{challengeItem.winner_left}}</div>
            </q-card-section>
        </q-card >
    </q-infinite-scroll>
</template>

<script setup>
import { onActivated } from 'vue'
import { useChallenge } from '../composables/useChallenge'

const { challenge, getList, getListUpdates } = useChallenge()

const onLoad = async function (index, done) {
  const isDone = await getList(index)
  done(isDone)
}
onActivated(() => {
  if (challenge.list.length > 0) getListUpdates()
})

</script>
