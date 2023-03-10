<template>
    <q-page-wrapper>
        <q-app-header class="bg-white rounded-b-md bordered" reveal>
            <q-btn flat icon="arrow_back"  @click="$router.go(-1);" v:slot="back-button"/>
            <q-toolbar-title>Challenges</q-toolbar-title>
        </q-app-header>
        <q-page class="bg-white q-pa-sm" style="padding-top: 50px">
            <QuestList :classroom-id="route.params.classroom_id"/>
        </q-page>
    </q-page-wrapper>
</template>

<script setup >
import { useRoute } from 'vue-router'
import QuestList from '../components/QuestList.vue'

const route = useRoute()
</script>
