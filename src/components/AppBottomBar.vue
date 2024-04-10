<template>
  <q-page-sticky
    position="bottom"
    v-show="bottomBarEnabled"
    class="bg-white rounded-t-md text-primary"
    style="z-index: 10; box-shadow: 0px 0px 0px 1px lightgray"
  >
    <q-tabs>
      <q-route-tab icon="map" :to="`${routes.course}`" exact replace/>
      <q-route-tab icon="task_alt" :to="routes.quests" exact replace />
      <q-route-tab icon="biotech" :to="routes.skills" exact replace />
      <q-route-tab icon="stacked_line_chart" :to="routes.leaderboard" exact replace />
      <q-route-tab icon="person_outline" :to="routes.user" exact replace />
    </q-tabs>
  </q-page-sticky>
</template>

<script setup>
import { useNavigationHistory } from '../composables/useNavigationHistory'
import { useRoute, useRouter } from 'vue-router'
import { watch, ref } from 'vue'

const { routes } = useNavigationHistory();
const route = useRoute();
const router = useRouter();
const isRootPage = ref(false);
const bottomBarEnabled = ref(false);

isRootPage.value = route.fullPath.split('/').length === 2
bottomBarEnabled.value = route.meta.bottomBarEnabled === true

watch(route, (currentValue, oldValue) => {
  isRootPage.value = currentValue.fullPath.split('/').length === 2
  bottomBarEnabled.value = currentValue.meta.bottomBarEnabled === true

});


</script>
