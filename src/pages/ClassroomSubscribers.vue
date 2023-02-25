<template>
  <q-page-container>
    <q-app-header class="bg-white rounded-b-md bordered" reveal>
        <q-btn flat icon="arrow_back"  @click="$router.go(-1);" v:slot="back-button"/>
        <q-toolbar-title>Subscribers</q-toolbar-title>
    </q-app-header>
    <q-page class="bg-white q-pa-sm" style="padding-top: 50px">
        <ClassroomSubscriberList/>
    </q-page>
  </q-page-container>
</template>

<script setup >
import ClassroomSubscriberList from '../components/ClassroomSubscriberList.vue'
</script>
