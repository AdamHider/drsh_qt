<template>
    <q-card class="transparent absolute-bottom full-width full-height flex" flat>
        <div v-if="!lessonAudio.is_playing"
            @click="lessonAudio.is_playing = true; playAudioAll();"
            class="absolute full-width full-height flex justify-center content-center"
        >
            <q-btn
                color="accent"
                icon="play_arrow"
                size="lg"
            />
        </div>
        <div v-if="lessonAudio.is_playing"
            @click="pauseAudio"
            class="absolute full-width full-height flex justify-center content-center"
        >
            <q-btn
                color="accent"
                icon="pause"
                size="lg"
            />
        </div>
        <q-toolbar class="self-end" style="background: #00000070;">
            <q-btn v-if="!lessonAudio.is_playing" flat color="white" dense icon="play_arrow" @click="lessonAudio.is_playing = true; playAudioAll();"/>
            <q-btn v-if="lessonAudio.is_playing" flat color="white" dense icon="pause" @click="pauseAudio"/>
            <q-toolbar-title>
                <div v-if="lessonAudio.list.length > 0" class="row full-width rounded-borders" style="background: #ffffffb0; overflow: hidden;">
                    <q-linear-progress v-for="(audio, index) in lessonAudio.list"
                        :key="index"
                        instant-feedback
                        size="15px"
                        :value="(audio?.currentTime * 100 / audio?.element.duration) / 100"
                        color="primary"
                        class="col cursor-pointer"
                        @click="playAudio(audio?.filename)"
                        :style="`flex: ${audio?.element.duration}; border-left: 1px solid #0f4e8c;`"/>
            </div>
            </q-toolbar-title>
        </q-toolbar>
    </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { useLessonAudio } from '../../composables/useLessonAudio'

const { lessonAudio, playAudioAll, playAudio, pauseAudio, stopAudio } = useLessonAudio()

</script>
