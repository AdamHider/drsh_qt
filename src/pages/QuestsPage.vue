<template>
  <q-page-wrapper>
    <q-app-header class="rounded-b-md" reveal>
        <q-toolbar-title>Квесты</q-toolbar-title>
    </q-app-header>
    <q-page class="bg-white" style="padding-top: 50px; padding-bottom: 35px;">
      <div class="q-pb-md">
        <QuestList active-only/>
      </div>
    </q-page>
  </q-page-wrapper>
</template>

<script setup >
import QuestList from '../components/QuestList.vue'
</script>
