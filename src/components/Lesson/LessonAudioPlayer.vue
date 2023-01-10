<template>
    <q-card class="bg-white text-dark no-border-radius">
        <q-linear-progress rounded instant-feedback size="15px" :value="lessonAudio.progress.value" color="secondary" class="q-mt-sm" />
        <q-btn-group>
            <q-btn v-if="!lessonAudio.is_playing" color="accent" icon="play_arrow" @click="lessonAudio.is_playing = true; playAudioAll();"/>
            <q-btn v-if="lessonAudio.is_playing" color="accent" icon="pause" @click="pauseAudio"/>
            <q-btn v-if="lessonAudio.is_playing" color="accent" icon="stop" @click="stopAudio"/>
        </q-btn-group>
    </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { useLessonAudio } from '../../composables/useLessonAudio'

const { lessonAudio, playAudioAll, pauseAudio, stopAudio } = useLessonAudio()

</script>
