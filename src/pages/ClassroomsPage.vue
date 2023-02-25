<template>
    <q-page-wrapper>
        <q-app-header class="bg-white rounded-b-md bordered" reveal>
            <q-btn flat icon="arrow_back"  @click="$router.go(-1);" v:slot="back-button"/>
            <q-toolbar-title>Explore classrooms</q-toolbar-title>
        </q-app-header>
        <q-page class="bg-white q-pa-sm" style="padding-top: 50px">
            <ClassroomList/>
        </q-page>
    </q-page-wrapper>
</template>

<script setup >
import ClassroomList from '../components/ClassroomList.vue'
</script>
