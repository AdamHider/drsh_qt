<template>
    <q-header class="bg-white text-black shadow-2">
        <q-toolbar>
            <q-btn flat icon="arrow_back" class="q-mr-sm" v-on:click="$router.go(-1);"/>
            <q-toolbar-title>Achievements</q-toolbar-title>
        </q-toolbar>
    </q-header>
    <q-page-container>
        <q-page class="bg-white q-pa-sm" >
            <AchievementList/>
        </q-page>
    </q-page-container>
</template>

<script setup >
import AchievementList from '../components/AchievementList.vue'

</script>