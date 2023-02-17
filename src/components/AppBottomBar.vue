<template>
    <q-tabs>
        <q-route-tab
            icon="rocket_launch"
            :to="routes.course"
            exact
        />
        <q-route-tab
            icon="search"
            :to="routes.explore"
            exact
        />
        <q-route-tab
            icon="group"
            :to="routes.classroom"
            exact
        />
        <q-route-tab
            icon="bar_chart"
            :to="routes.leaderboard"
            exact
        />
        <q-route-tab
            icon="person"
            :to="routes.user"
            exact
        />
    </q-tabs>
</template>

<script setup>

import { useNavigationHistory } from '../composables/useNavigationHistory'

const { routes } = useNavigationHistory()
</script>
