<template>
    <q-card flat>
        <q-card-section class="q-py-none">
            <div class="text-caption text-grey">{{ props.description }}</div>
        </q-card-section>
    </q-card>
</template>

<script setup>
import { CONFIG } from '../config.js'

const defaultImage = `${CONFIG.API_HOST}/image/not_found.png`

const props = defineProps({
  title: String,
  description: String,
  image: String,
  defaultImage: Boolean
})

</script>
