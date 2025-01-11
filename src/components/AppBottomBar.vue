<template>
  <transition
  appear
    enter-active-class="animated slideInUp"
    leave-active-class="animated slideOutDown">
  <q-page-sticky
    position="bottom"
    v-show="bottomBarEnabled"
    class="bg-white rounded-t-md text-primary"
    style="z-index: 10; box-shadow: 0px 0px 0px 1px lightgray"
  >
    <q-tabs>
      <q-route-tab icon="map" :to="`${routes.course.link}`" exact replace>
        <q-badge v-if="routes.course.is_updated" color="red" rounded floating />
      </q-route-tab>
      <q-route-tab icon="task_alt" :to="routes.quests.link" exact replace>
        <q-badge v-if="routes.quests.is_updated" color="red" rounded floating />
      </q-route-tab>
      <q-route-tab icon="biotech" :to="routes.skills.link" exact replace>
        <q-badge v-if="routes.skills.is_updated" color="red" rounded floating />
      </q-route-tab>
      <q-route-tab icon="stacked_line_chart" :to="routes.leaderboard.link" exact replace>
      </q-route-tab>
      <q-route-tab icon="person_outline" :to="routes.user.link" exact replace>
        <q-badge v-if="routes.user.is_updated" color="red" rounded floating />
      </q-route-tab>
    </q-tabs>
  </q-page-sticky>
  </transition>
</template>

<script setup>
import { useNavigationHistory } from '../composables/useNavigationHistory'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
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
