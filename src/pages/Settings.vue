<template>
  <v-app-bar density="compact" >
      <template v-slot:prepend>
          <v-btn icon="mdi-arrow-left" v-on:click="$router.go(-1);"></v-btn>
      </template>
      <v-app-bar-title>Achievements</v-app-bar-title>
  </v-app-bar>
  <page-container no-bottom-bar="true" background="white" container-class="pa-0" align="start" >
      
  </page-container>
</template>

<script setup >
</script>