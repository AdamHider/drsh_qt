<template>
    <q-infinite-scroll @load="onLoad">
        <template v-slot:loading>
            <div class="row justify-center q-my-md">
            <q-spinner color="primary" name="dots" size="40px" />
            </div>
        </template>
        <q-card  v-for="(homeworkItem, index) in homework.list" :key="index" class="q-ma-sm"
        :style="`background: ${homeworkItem.course_section.background_gradient}; transform: none`">
            <q-card-section >
            <q-item class="q-pa-none">
                <q-item-section avatar>
                    <q-avatar size="80px">
                        <q-img
                          :src="homeworkItem.image"
                          loading="lazy"
                          spinner-color="white"/>
                    </q-avatar>
                </q-item-section>
                <q-item-section class="text-left text-white">
                    <div class="text-bold">{{homeworkItem.description.title}}</div>
                    <div class="text-caption">{{homeworkItem.description.description}}</div>
                    <div class="text-left">
                      <q-chip
                          v-if="homeworkItem.time_left_humanized"
                          dense
                          class="q-mx-none"
                          style="font-size: 13px"
                          :color="((homeworkItem.time_left <= 3) ? 'red' : 'orange')"
                          icon="sports_score"
                          text-color="white">
                          <b>{{ homeworkItem.time_left_humanized }}</b>
                      </q-chip>
                    </div>
                    <div class="row q-ma-sm" v-if="homeworkItem.exercise?.data">
                        <div class="col text-left"></div>
                        <div class="col  text-right">
                            <b>{{(homeworkItem.exercise?.data.current_page * 100 / homeworkItem.exercise?.data.total_pages) / 100}}</b>
                        </div>
                    </div>
                    <q-linear-progress
                        v-if="homeworkItem.exercise?.data"
                        :color="(homeworkItem.exercise?.current_progress/100) >= 1 ? 'positive' : 'primary'"
                        :value="((homeworkItem.exercise?.data.current_page * 100 / homeworkItem.exercise?.data.total_pages) / 100)"
                        size="10px"
                        rounded
                    ></q-linear-progress>
                </q-item-section>
            </q-item>
            </q-card-section >
        </q-card >
    </q-infinite-scroll>
</template>

<script setup>
import { useHomework } from '../composables/useHomework'

const { homework, getList } = useHomework()

const onLoad = async function (index, done) {
  const isDone = await getList(index)
  done(isDone)
}

</script>
