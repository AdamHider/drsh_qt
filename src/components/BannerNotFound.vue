<template>
    <q-card flat class="text-center q-pa-md">
        <q-img v-if="props.image || props.defaultImage"
            :src="(props.image) ? props.image : defaultImage"
            width="80px"
        />
        <q-card-section>
            <div class="text-subtitle1"><b>{{ props.title }}</b></div>
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
