<template>
    <q-infinite-scroll @load="onLoad">
        <template v-slot:loading>
            <div class="row justify-center q-my-md">
            <q-spinner color="primary" name="dots" size="40px" />
            </div>
        </template>
        <q-card  v-for="(achievementItem, index) in achievement.list" :key="index" class="q-ma-sm">
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
import { useAchievement } from '../composables/useAchievement'

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
