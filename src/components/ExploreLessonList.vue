<template>
  <div>
    <div  v-for="(courseSection, courseSectionIndex) in courseSections" :key="`courseSectionIndex-${courseSectionIndex}`" >
        <q-card flat>
          <q-card-section class="q-pb-none q-pt-sm">
            <div class="text-subtitle1"><b>{{ courseSection.title }}</b></div>
            <div class="text-caption text-grey-9 max-two-lines">{{ courseSection.description }}</div>
          </q-card-section>
          <q-card-section class="q-px-none q-py-sm">
            <swiper
              :slidesPerView="props.slidesPerView"
              :spaceBetween="8"
              :slidesOffsetBefore="16"
              :slidesOffsetAfter="16"
            >
              <swiper-slide v-for="(lesson, lessonIndex) in courseSection.list" :key="`lessonIndex-${lessonIndex}`" :class="'text-center'">
                <q-card
                    :class="`q-push  relative-position rounded-sm  text-white text-shadow ${lesson.is_blocked ? 'is-blocked' : ''}`" @click="router.push(`/lesson-startup-${lesson.id}`)"
                    :style="`margin-top: 30px; background-image: linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${lesson.course_section.background_image}); background-size: cover; background-position: center;`">
                  <q-card-section class="q-pb-none">
                    <q-img class="planet-image" :src="lesson.image" width="100px" style="filter: drop-shadow(rgba(53, 173, 244, 0.62) 0px 5px 10px); margin-top: -40px;" no-spinner/>
                  </q-card-section>
                  <q-card-section class="q-pt-sm q-px-xs">
                    <div class="text-subtitle1"><b>{{ lesson.title }}</b></div>
                    <div class="text-sm max-two-lines">{{ lesson.type }}</div>
                  </q-card-section>
                  <q-btn v-if="lesson.is_blocked" round class="absolute-top-right" color="dark" icon="lock" push style="top: -5px; right: -5px; rotate: 15deg"></q-btn>
                </q-card>
              </swiper-slide>
            </swiper>
          </q-card-section>
        </q-card>
    </div>
  </div>
  <div v-if="lessons.length > 0" style="height: 0px;">
      <div v-for="(lessonItem, index) in lessons" :key="`lessonItemImage${index}`">
      <img :src="lessonItem.image" width="1px"/>
    </div>
  </div>
</template>

<script setup>
import { ref, toRef, onMounted, onActivated, watch } from 'vue'
import { useExplore } from '../composables/useExplore'
import { useRouter } from "vue-router";
import { Swiper, SwiperSlide } from 'swiper/vue'

import 'swiper/css'

const router = useRouter();

const { explore, getList  } = useExplore()

const error = ref(false)

const lessons = ref([])
const courseSections = ref([])

const props = defineProps({
  activeOnly: Boolean,
  type: String,
  slidesPerView: Number,
  reloadTrigger: Boolean
})

const reloadTrigger = toRef(props, "reloadTrigger");

const load = async () => {
  const lessonListResponse = await getList({type: props.type})
  if (lessonListResponse.error) {
    error.value = lessonListResponse
    lessons.value = []
    return false;
  }

  lessons.value = lessonListResponse//.sort((a, b) => a.is_blocked ? 1 : -1);
  composeList()
  console.log(courseSections.value)
}

const composeList = () => {
  var result = []
  const courseSectionsRaw = lessons.value.reduce((result, obj) => {
    result[obj.course_section_id] = result[obj.course_section_id] || {
        ... obj.course_section, ...{ expandDescription: false, list: [] }
      };
      result[obj.course_section_id].list.push(obj);
      return result;
  }, {})
  const courseSectionIds = Object.keys(courseSectionsRaw)

  for(var i in courseSectionIds){
    var couseSection = courseSectionsRaw[courseSectionIds[i]]
    couseSection.list[0].is_initial = true

    couseSection.list = couseSection.list
    result.push(couseSection)

  }
  courseSections.value = result
};

onActivated(() => {
  //load()
})
onMounted(() => {
  load()
})

</script>
<style scoped lang="scss">
.is-blocked{
  filter: grayscale(1) brightness(0.9);
}
.daily-lesson-avatar{
  &.lesson{
    box-shadow: inset 0 0 0 2px $yellow;
  }
  &.unexplored:before{
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-shadow: 0 0 0 1px $secondary;
    border-radius: inherit;
    animation: pulseSignal 1.5s ease infinite;

  }
  &.unexplored:after{
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-shadow: 0 0 0 1px $secondary;
    border-radius: inherit;
    animation: pulseSignal 1.5s ease 0.2s infinite;
  }
}

@keyframes pulseSignal {
  0%{
    transform: scale(1);
    opacity: 1;
  }
  50%, 100%{
    transform: scale(1.5);
    opacity: 0;
  }
}
@keyframes pulseSignalShadow {
  0%{
    filter: drop-shadow(0 0 5px $yellow)
  }
  100%{
    filter: drop-shadow(0 0 0px $yellow)
  }
}


</style>
