<template>
    <q-card  v-for="(achievement, index) in achievements.list" class="q-ma-sm">
        <q-card-section >
        <q-item class="q-pa-none bg-white">
            <q-item-section avatar>
                <q-avatar>
                    <img :src="`${CONFIG.API_HOST}${achievement.image}`" />
                </q-avatar>
            </q-item-section>
            <q-item-section class="text-left">
                <div class="text-bold">{{achievement.description.title.ru}}</div>
                <div class="text-grey">{{achievement.description.description.ru}}</div>
                <q-linear-progress 
                    color="primary"
                    :value="achievement.achievement_progress.percentage" 
                    size="20px" 
                    rounded
                ></q-linear-progress>
            </q-item-section>
        </q-item>
        </q-card-section >
    </q-card >
</template>


<script setup>
import { useAchievement } from '../composables/useAchievement'
import { CONFIG } from '../config.js'
import { onMounted, onActivated, onDeactivated} from "vue"

const { achievements, getList } = useAchievement()


//onActivated(() => {
    console.log('empty');
    getList();
//});




</script>