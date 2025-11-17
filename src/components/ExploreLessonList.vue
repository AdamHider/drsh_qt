<template>
  <div>
    <div class="q-mb-sm">
      <q-input
        class="q-ma-sm"
        standout
        v-model="formData.search"
        placeholder="Поиск планет..."
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
    <div v-for="(courseSection, courseSectionIndex) in courseSections" :key="`courseSectionIndex-${courseSectionIndex}`" >
        <q-card flat>
          <q-card-section class="q-pb-none q-pt-sm">
            <q-item class="q-px-none q-pb-none items-start">
              <q-item-section>
                <div class="text-subtitle1"><b>{{ courseSection.title }}</b></div>
              </q-item-section>
              <q-item-section side>
                <a flat size="sm" @click="activeCourseSection = courseSection; dialog = true">Показать все</a>
              </q-item-section>
            </q-item>
          </q-card-section>
          <q-card-section class="q-pa-none">
            <swiper
              :slidesPerView="props.slidesPerView"
              :spaceBetween="8"
              :slidesOffsetBefore="16"
              :slidesOffsetAfter="16"
            >
              <swiper-slide v-for="(lesson, lessonIndex) in courseSection.list" :key="`lessonIndex-${lessonIndex}`" :class="'text-center'">
                <q-card
                    :class="`q-push relative-position rounded-sm  text-white text-shadow ${lesson.is_blocked ? 'is-blocked' : ''}`" @click="router.push(`/lesson-startup-${lesson.id}`)"
                    :style="`margin-top: 30px; border-color: rgba(0, 0, 0, 0.7); background-image: linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0)), url(${(lesson.background_image) ? lesson.background_image : lesson.course_section.background_image}); background-size: cover; background-position: center;`">
                  <q-card-section class="q-pb-none">
                    <q-img class="planet-image allow-overflow" :src="lesson.image" width="100px" style="filter: drop-shadow(rgba(53, 173, 244, 0.62) 0px 5px 10px); margin-top: -40px;" no-spinner/>
                  </q-card-section>
                  <q-card-section class="q-pt-sm q-px-xs">
                    <div class="text-subtitle1"><b>{{ lesson.title }}</b></div>
                    <div class="text-caption" v-if="lesson.progress > 0">
                      <b>Изучено: </b>
                      <b :class="lesson.progress > 0 ? ((lesson.progress == 100) ? 'text-positive' : 'text-warning') : ''">{{ lesson.progress }}%</b>
                    </div>
                    <div class="text-caption text-grey-4" v-else>
                      <b v-if="lesson.is_blocked">Премиум-планета</b>
                      <b  v-else>Не изучено</b>
                    </div>
                  </q-card-section>
                  <q-btn v-if="lesson.is_blocked" round class="absolute-top-right" color="dark" icon="lock" push style="top: -5px; right: -5px; rotate: 15deg"></q-btn>
                </q-card>
              </swiper-slide>
            </swiper>
          </q-card-section>
        </q-card>
    </div>
  </div>
  <q-dialog v-model="dialog" position="bottom">
    <q-card class="q-push full-width">
      <q-card-section class="q-px-none ">
        <q-item class="q-py-none text-left items-start">
          <q-item-section >
            <div class="text-subtitle1"><b>{{ activeCourseSection.title }}</b></div>
            <div :class="`text-caption satellite-description ${(expandDescription) ? '': 'max-two-lines'}`" @click="expandDescription = !expandDescription">
              {{activeCourseSection.description}}
            </div>
            <div class="text-caption" @click="expandDescription = !expandDescription"  @click.stop="playAudio('click')">
              <b v-if="expandDescription">Свернуть <q-icon name="keyboard_arrow_up"></q-icon></b>
              <b v-else>Показать ещё <q-icon name="keyboard_arrow_down"></q-icon></b>
            </div>
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-separator/>
      <q-card-section style="max-height: 50vh" class="scroll">
        <q-list>
          <q-item v-for="(lessonItem, lessonItemIndex) in activeCourseSection.list" :key="`lessonItemIndex-${lessonItemIndex}`" clickable v-ripple
            :class="`q-push q-mt-sm relative-position rounded-sm  text-white text-shadow ${lessonItem.is_blocked ? 'is-blocked' : ''}`" @click="router.push(`/lesson-startup-${lessonItem.id}`)"
            :style="`border-color: rgba(0, 0, 0, 0.7); background-image: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0)), url(${(lessonItem.background_image) ? lessonItem.background_image : lessonItem.course_section.background_image}); background-size: cover; background-position: center;`">
            <q-item-section avatar>
              <q-img class="planet-image allow-overflow" :src="lessonItem.image" width="80px" style="filter: drop-shadow(rgba(53, 173, 244, 0.62) 0px 5px 10px);" no-spinner/>
            </q-item-section>
            <q-item-section>
              <div class="text-subtitle1"><b>{{ lessonItem.title }}</b></div>
              <div class="text-sm max-two-lines">{{ lessonItem.description }}</div>
              <div class="text-caption  q-my-xs" v-if="lessonItem.progress > 0">
                <b>Изучено: </b>
                <b :class="lessonItem.progress > 0 ? ((lessonItem.progress == 100) ? 'text-positive' : 'text-warning') : ''">{{ lessonItem.progress }}%</b>
              </div>
              <div class="text-caption q-my-xs text-grey-4" v-else>
                <b v-if="lessonItem.is_blocked">Премиум-планета</b>
                <b  v-else>Не изучено</b>
              </div>
            </q-item-section>
            <q-btn v-if="lessonItem.is_blocked" round class="absolute-top-right" color="dark" icon="lock" push style="top: -5px; right: -5px; rotate: 15deg"></q-btn>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions>
        <q-btn color="gradient-primary" push class="full-width" v-close-popup>Продолжить</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, toRef, onMounted, onActivated, reactive, watch } from 'vue'
import { useExplore } from '../composables/useExplore'
import { useRouter } from "vue-router";
import { Swiper, SwiperSlide } from 'swiper/vue'
import { playAudio } from 'src/services/audioService';

import 'swiper/css'

const router = useRouter();

const { explore, getList  } = useExplore()

const error = ref(false)
const expandDescription = ref(false)

const dialog = ref(false)
const activeCourseSection = ref({})

const lessons = ref([])
const courseSections = ref([])
const tags = ref([])
const formData = reactive({
  tags: [],
  search: ''
})

const props = defineProps({
  activeOnly: Boolean,
  type: String,
  slidesPerView: Number,
  reloadTrigger: Boolean
})

const reloadTrigger = toRef(props, "reloadTrigger");

const load = async () => {
  const filter = {
    tags: formData.tags,
    search: formData.search,
    type: props.type
  }
  const lessonListResponse = await getList(filter)
  if (lessonListResponse.error) {
    error.value = lessonListResponse
    lessons.value = []
    composeList()
    return false;
  }

  lessons.value = lessonListResponse//.sort((a, b) => a.is_blocked ? 1 : -1);
  composeList()
  composeTags()
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

const composeTags = () => {
  tags.value = []
  let tagsRaw = []
  for(var i in lessons.value){
    tagsRaw = tagsRaw.concat(lessons.value[i].tags)
  }
  tagsRaw = tagsRaw.filter((item, pos) => tagsRaw.indexOf(item) === pos)
  tagsRaw = tagsRaw.sort((a, b) => (formData.tags.indexOf(b) > -1) ? 1 : -1);
  tags.value = tagsRaw
}

const addActiveTag = (tag) => {
  if(formData.tags.indexOf(tag) > -1){
    formData.tags = formData.tags.filter((item) => item !== tag)
  } else {
    formData.tags.push(tag)
  }
}

const onClose = () => {

}

onActivated(() => {
  //load()
})
onMounted(() => {
  load()
})
watch(formData, () => {
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
