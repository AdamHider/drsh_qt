<template>
    <div>
    </div>
</template>

<script setup>
import { useExercise } from '../composables/useExercise.js'
import { useUserStore } from '../stores/user'

const { user } = useUserStore()
const { getLeaderboard } = useExercise()

const leaderboard = getLeaderboard({ classroom_id: user.active.data.profile.classroom_id, time_period: 'month' })

</script>
