<template>
    <q-app-header class="bg-white rounded-b-md bordered" reveal>
        <q-btn flat icon="arrow_back"  @click="$router.go(-1);" v:slot="back-button"/>
        <q-toolbar-title>Challenges</q-toolbar-title>
    </q-app-header>
    <q-page class="bg-white q-pa-sm" style="padding-top: 50px">
        <ChallengeList/>
    </q-page>
</template>

<script setup >
import ChallengeList from '../components/ChallengeList.vue'
</script>
