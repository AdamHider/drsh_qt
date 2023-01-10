<template>
    <q-card class="bg-white text-dark no-border-radius">
        <div v-if="lessonAudio.list.length > 0" class="row">
          <q-linear-progress v-for="(audio, index) in lessonAudio.list"
            :key="index"
            instant-feedback
            :animation-speed="100"
            size="15px"
            :value="(audio?.currentTime * 100 / audio?.element.duration) / 100"
            color="secondary"
            class="col q-mt-sm"/>
        </div>
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

console.log()

</script>
