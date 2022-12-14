<template>
    <q-tabs>
        <q-route-tab
            icon="home"
            :to="routes.home"
            exact
        />
        <q-route-tab
            icon="group"
            :to="routes.classroom"
            exact
        />
        <q-route-tab
            icon="notifications"
            :to="routes.notifications"
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
