<template>
  <q-page-container>
    <q-app-header class="bg-white rounded-b-md bordered" reveal>
        <q-btn flat icon="arrow_back"  @click="$router.go(-1);" v:slot="back-button"/>
        <q-toolbar-title>Settings</q-toolbar-title>
        <q-btn flat icon="check" @click="saveChanges()"/>
    </q-app-header>
    <q-page class="bg-white q-pa-sm" style="padding-top: 50px">
    </q-page>
  </q-page-container>
</template>

<script setup >
const saveChanges = async function () {

}
</script>
