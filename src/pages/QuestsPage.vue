<template>
  <q-page-wrapper>
    <q-app-header class="rounded-b-md" reveal>
        <q-toolbar-title>Quests</q-toolbar-title>
    </q-app-header>
    <q-page class="bg-white q-pa-sm" style="padding-top: 50px">
        <QuestList active-only/>
    </q-page>
  </q-page-wrapper>
</template>

<script setup >
import QuestList from '../components/QuestList.vue'
</script>
