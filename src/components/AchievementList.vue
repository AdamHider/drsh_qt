<template>
    <q-infinite-scroll @load="onLoad">
        <template v-slot:loading>
            <div class="row justify-center q-my-md">
            <q-spinner color="primary" name="dots" size="40px" />
            </div>
        </template>
        <q-card  v-for="(achievement, index) in achievement.list" :key="index" class="q-ma-sm">
            <q-card-section >
            <q-item class="q-pa-none bg-white">
                <q-item-section avatar>
                    <q-avatar size="80px">
                        <q-img
                          :src="`${CONFIG.API_HOST}/images/dershane/${achievement.image}`"
                          loading="lazy"
                          spinner-color="white"/>
                    </q-avatar>
                </q-item-section>
                <q-item-section class="text-left">
                    <div class="text-bold">{{achievement.description.title.ru}}</div>
                    <div class="text-grey">{{achievement.description.description.ru}}</div>
                    <div class="row q-ma-sm">
                        <div class="col text-left"></div>
                        <div class="col  text-right">
                            <b>{{achievement.achievement_progress.current_progress}}/{{achievement.achievement_progress.target_progress}}</b>
                        </div>
                    </div>
                    <q-linear-progress
                        :color="(achievement.achievement_progress.percentage/100) >= 1 ? 'positive' : 'primary'"
                        :value="(achievement.achievement_progress.percentage/100)"
                        size="20px"
                        rounded
                    ></q-linear-progress>
                </q-item-section>
            </q-item>
            </q-card-section >
        </q-card >
    </q-infinite-scroll>
</template>

<script setup>
import { useAchievement } from '../composables/useAchievement'
import { CONFIG } from '../config.js'

const { achievement, getList } = useAchievement()

const onLoad = async function (index, done) {
  const isDone = await getList(index)
  done(isDone)
}

// onActivated(() => {
// console.log('empty');
// getList();
// });

</script>
