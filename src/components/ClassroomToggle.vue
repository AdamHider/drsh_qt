<template  withBackground="true">
    <q-chip class="transparent no-shadow"  style="color: inherit"
        clickable
        @click="dialog = true"
    >
        <q-avatar size="30px">
          <img :src="`${CONFIG.API_HOST}${classroom.active?.introimage}`"/>
        </q-avatar>
        <div class="ellipsis">
            <b>{{classroom.active?.title}}</b>
            <q-tooltip>{{classroom.active?.title}}</q-tooltip>
            <q-icon name="expand_more" size="sm"></q-icon>
        </div>
    </q-chip>
    <q-dialog v-model="dialog" position="top">
      <q-card>
        <q-card-section class="q-pb-none">
          <div class="text-h6">Choose your classroom</div>
        </q-card-section>
        <q-card-section class="q-px-none">
          <ClassroomSlider
            :slidesPerView=1.5
            :centerAligned="false"
            :withButton="false"
            slideHeight="130"
            :navigation="false"
            captionMode="full"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useClassroom } from '../composables/useClassroom'
import ClassroomSlider from '../components/ClassroomSlider.vue'
import { CONFIG } from '../config.js'

const { classroom } = useClassroom()

const dialog = ref(false)

</script>
