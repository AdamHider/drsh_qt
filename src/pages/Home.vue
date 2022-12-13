<template>
    <q-header>
      <q-toolbar>
        <q-btn flat round dense icon="menu" class="q-mr-sm" />
        <q-toolbar-title>Quasar App</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page style="background-color: pink;">
        <div class="text-body-2 font-weight-light mb-n1">Welcome to</div>
        <h1 class="text-h2 font-weight-bold">Home</h1>
            <CourseList/>
    </q-page>
</template>

<script setup>
import CourseList from '../components/CourseList.vue'


</script>
