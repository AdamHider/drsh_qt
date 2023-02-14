<template>
    <div>
        <q-list>
            <q-item v-for="(commonItem, commonKey) in leaderboard.data.common_statistics?.list" :key="commonKey" class="q-my-sm q-px-none" >
                <q-item-section avatar>
                    <q-avatar rounded  color="primary" text-color="white" size="50px">
                        <q-icon name="star" color="blue-6" size="50px" class="absolute-top"/>
                        <b style="z-index: 1">{{ commonItem.points }}</b>
                    </q-avatar>
                </q-item-section>
                <q-item-section>
                    <q-item-label><b>{{ commonItem.place }} place</b></q-item-label>
                    <q-item-label caption lines="1">{{ commonItem.usernames }}</q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-icon name="chat_bubble" color="green" />
                </q-item-section>
            </q-item>
        </q-list>
    </div>
</template>

<script setup>
import { reactive, onActivated } from 'vue'
import { useExercise } from '../composables/useExercise.js'
import { useUserStore } from '../stores/user'

const { user } = useUserStore()
const { getLeaderboard } = useExercise()

const leaderboard = reactive({
  data: {}
})

onActivated(async () => {
  leaderboard.data = await getLeaderboard({ classroom_id: user.active.data.profile.classroom_id, time_period: 'month' })
})

</script>
