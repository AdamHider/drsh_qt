<template>
  <router-view />
</template>

<script setup>
// Composables
import { watch } from 'vue'
import { useUserStore } from './stores/user'
import { useClassroom } from './composables/useClassroom'
import { useAppMessage } from './composables/useAppMessage'
async function init () {

    const { user, autoSignIn } = useUserStore()

    await autoSignIn()

    const { getActive, getList } = useClassroom()
    getActive();

    watch(user.active, (newData, oldData) => {
        console.log('watched');
        getActive();
        getList();
    });
}
init();

</script>
