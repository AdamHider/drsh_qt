<template>
    <q-card flat class="text-center q-pa-md">
        <q-img v-if="props.image || props.defaultImage"
            :src="(props.image) ? props.image : defaultImage"
            width="120px"
        />
        <q-card-section class="q-pb-none">
            <div class="text-h6">{{ props.title }}</div>
        </q-card-section>
        <q-card-section class="q-py-none">
            {{ props.description }}
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
