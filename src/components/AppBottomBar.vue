<template>
    <q-tabs>
        <q-route-tab
            icon="rocket_launch"
            :to="`${routes.course}-${(course.active.id) ? course.active.id : user.active.data.settings.course_id}`"
            exact replace
        />
        <q-route-tab
            icon="search"
            :to="routes.explore"
            exact replace
        />
        <q-route-tab
            icon="group"
            :to="routes.classroom"
            exact replace
        />
        <q-route-tab
            icon="bar_chart"
            :to="routes.leaderboard"
            exact replace
        />
        <q-route-tab
            icon="person"
            :to="routes.user"
            exact replace
        />
    </q-tabs>
</template>

<script setup>

import { useUserStore } from '../stores/user'
import { useClassroom } from '../composables/useClassroom'
import { useCourse } from '../composables/useCourse'
import { useNavigationHistory } from '../composables/useNavigationHistory'
import { useRoute } from 'vue-router'
import { watch } from 'vue'

const { classroom } = useClassroom()
const { user } = useUserStore()
const { course } = useCourse()
const { routes, watchRoute } = useNavigationHistory()
const route = useRoute()
/*
watch(route, (newData, oldData) => {
  console.log(route)
  watchRoute(route)
}) */
</script>
