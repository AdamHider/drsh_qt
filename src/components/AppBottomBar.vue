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
    <q-tabs >
      <q-route-tab  :to="`${routes.course.link}`" exact replace>
        <q-img :src="`/icons/rocket${(routes.course.is_active) ? '_active' : ''}.svg`" width="32px"></q-img>
        <q-badge v-if="routes.course.is_updated" color="red" rounded floating />
      </q-route-tab>
      <q-route-tab :to="routes.skills.link" exact replace>
        <q-img :src="`/icons/microscope${(routes.skills.is_active) ? '_active' : ''}.svg`" width="32px"></q-img>
        <q-badge v-if="routes.skills.is_updated" color="red" rounded floating />
      </q-route-tab>
      <q-route-tab  :to="routes.leaderboard.link" exact replace>
        <q-img :src="`/icons/leaderboard${(routes.leaderboard.is_active) ? '_active' : ''}.svg`" width="32px"></q-img>
      </q-route-tab>
      <q-route-tab :to="routes.user.link" exact replace>
        <q-img :src="`/icons/account${(routes.user.is_active) ? '_active' : ''}.svg`" width="32px"></q-img>
        <q-badge v-if="routes.user.is_updated" color="red" rounded floating />
      </q-route-tab>
    </q-tabs>
  </q-page-sticky>
  </transition>
</template>

<script setup>
import { useNavigationHistory } from '../composables/useNavigationHistory'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { watch, ref, onMounted } from 'vue'
import { useNotification } from '../composables/useNotification'

const { notifications } = useNotification()

const { routes } = useNavigationHistory();
const route = useRoute();
const isRootPage = ref(false);
const bottomBarEnabled = ref(false);

onMounted(() => {
  checkActive()
})

watch(route, (currentValue, oldValue) => {
  checkActive()
});
const checkActive = () => {
  isRootPage.value = route.fullPath.split('/').length === 2
  bottomBarEnabled.value = route.meta.bottomBarEnabled === true
  const routeLinks = Object.keys(routes)
  for(var i in routeLinks){
    routes[routeLinks[i]].is_active = false
    if(routes[routeLinks[i]].link == route.fullPath){
      routes[routeLinks[i]].is_updated = false
      routes[routeLinks[i]].is_active = true
    }
  }
}
watch(() => notifications.value.level, () => {
  routes.user.is_updated = true
})
</script>

