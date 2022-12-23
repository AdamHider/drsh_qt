<template>
    <q-infinite-scroll @load="onLoad" reverse>
        <template v-slot:loading>
            <div class="row justify-center q-my-md">
            <q-spinner color="primary" name="dots" size="40px" />
            </div>
        </template>
        <q-page-sticky>
            <div :style="`background: ${groupGradient}`"></div>
            <div :style="`background-image: ${groupBackground}`"></div>
        </q-page-sticky>
        <div v-for="(lesson, index) in lesson.list"   :key="index"
            :class="`row ${(lesson.order % 2) ? 'justify-start' : 'justify-end'}`" 
            v-intersection="onIntersection"
            :groupBackground="lesson.parent_description.background_image"
            :groupGradient="lesson.parent_description.background_gradient"
        >
            <div :class="`col-6`">
                <q-card class="transparent no-shadow q-ma-sm">
                    <q-card-section >
                        <q-img
                            :src="`${CONFIG.API_HOST}/${lesson.image}`"
                            loading="lazy"
                            spinner-color="white"/>
                    </q-card-section>
                    <q-card-section class="text-center text-white q-pa-none">
                        <div class="text-bold">{{lesson.intro?.title}}</div>
                        <div class="row q-ma-sm">
                            <div class="col text-left"></div>
                            <div class="col  text-right">
                                <b>{{lesson.exercise?.current_page}}</b>
                            </div>
                        </div>
                    </q-card-section>
                </q-card >
            </div>
            </div>
    </q-infinite-scroll>
</template>

<script setup>
import { useLesson } from '../composables/useLesson'
import { CONFIG } from '../config.js'
import { ref } from 'vue'

const { lesson, getList } = useLesson()

const groupBackground = ref(null)
const groupGradient = ref(null)

const onLoad = async function (index, done) {
  const isDone = await getList(index)
  done(isDone)
}
const onIntersection = (entry) => {
    groupBackground.value = entry.attributes.groupBackground
    groupGradient.value = entry.attributes.groupGradient
    console.log(entry)
}
// onActivated(() => {
// console.log('empty');
// getList();
// });

</script>
