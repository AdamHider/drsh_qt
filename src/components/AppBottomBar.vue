<template>
  <q-page-sticky
    position="bottom"
    v-show="bottomBarEnabled"
    class="bg-dark text-white"
  >
    <q-tabs class="bg-dark">
      <q-route-tab icon="map" :to="`${routes.course}`" exact replace/>
      <q-route-tab icon="group" :to="routes.classroom" exact replace />
      <q-route-tab icon="science" :to="routes.skills" exact replace />
      <q-route-tab icon="bar_chart" :to="routes.leaderboard" exact replace />
      <q-route-tab icon="person" :to="routes.user" exact replace />
    </q-tabs>
  </q-page-sticky>
</template>

<script setup>
import { useNavigationHistory } from '../composables/useNavigationHistory'
import { useRoute } from 'vue-router'
import { watch, ref } from 'vue'

const { routes } = useNavigationHistory();
const route = useRoute();
const isRootPage = ref(false);
const bottomBarEnabled = ref(false);

isRootPage.value = route.fullPath.split('/').length === 2
bottomBarEnabled.value = route.meta.bottomBarEnabled === true

watch(route, (currentValue, oldValue) => {
  isRootPage.value = currentValue.fullPath.split('/').length === 2
  bottomBarEnabled.value = currentValue.meta.bottomBarEnabled === true
});
</script>
