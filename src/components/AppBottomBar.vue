<template>
  <q-page-sticky
    position="bottom"
    v-show="bottomBarEnabled"
    class="bg-white text-primary"
  >
    <q-tabs>
      <q-route-tab
        icon="map"
        :to="`${routes.course}-${
          course.active.id
            ? course.active.id
            : user.active.data?.settings?.course_id
        }`"
        exact
        replace
      />
      <q-route-tab icon="group" :to="routes.classroom" exact replace />
      <q-route-tab icon="bar_chart" :to="routes.leaderboard" exact replace />
      <q-route-tab icon="person" :to="routes.user" exact replace />
    </q-tabs>
  </q-page-sticky>
</template>

<script setup>
import { useUserStore } from "../stores/user";
import { useCourse } from "../composables/useCourse";
import { useNavigationHistory } from "../composables/useNavigationHistory";
import { useRoute } from "vue-router";
import { watch, provide, ref } from "vue";

const { user } = useUserStore();
const { course } = useCourse();
const { routes, watchRoute } = useNavigationHistory();
const route = useRoute();
const isRootPage = ref(false);
const bottomBarEnabled = ref(false);

provide("redirectedFrom", route.redirectedFrom);
isRootPage.value = route.fullPath.split("/").length === 2;
bottomBarEnabled.value = route.meta.bottomBarEnabled === true;

watch(route, (currentValue, oldValue) => {
  isRootPage.value = currentValue.fullPath.split("/").length === 2;
  bottomBarEnabled.value = currentValue.meta.bottomBarEnabled === true;
});
</script>
