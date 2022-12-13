<template>
    <swiper
      v-if="user.active.data.id"
      ref="classroomSlider"
      :modules="[Navigation, Pagination, Scrollbar, A11y]"
      :slides-per-view="props.slidesPerView"
      :centeredSlides="props.centerAligned"
      :initialSlide="classroom.list.findIndex((classroom) => classroom.code == user.active.authorization.classroom_code)"
      :navigation="props.navigation"
      @swiper="onSwiper"
      @slideChange="onSlideChange"
    >
      <swiper-slide v-for="(classroomItem, index) in classroom.list" :key="index" :class="'text-center'" @click="select(index)">
        <q-card class="q-ma-md">
            <q-img 
              fit="cover" 
              :src="(CONFIG.API_HOST+classroomItem.fulltext_image)"  
              :style="`height: ${props.slideHeight}px;`"
              >
              <div class="absolute-bottom text-center text-white">
                <div class="text-h6">{{classroomItem.title}}</div>
                <div class="subtitle">{{classroomItem.code}}</div>
              </div>
            </q-img>
        </q-card>
      </swiper-slide>
      <swiper-slide :class="'text-center'" @click="select(false)">
        <q-card class="q-ma-md">
            <q-img class="align-center pa-3"
              :style="`height: ${props.slideHeight}px;`">
              <q-icon name="plus"></q-icon>
            </q-img>
        </q-card>
      </swiper-slide>
    </swiper>
    <q-btn v-if="props.withButton" rounded="lg" @click="select()" :disabled="(activeItem.code == user.active.authorization.classroom_code)">
      <template v-if="(activeItem.id !== 0)">
        Enter {{activeItem.title}}
      </template>
      <template v-else>
        {{activeItem.title}}
      </template>
    </q-btn>
</template>
<script setup>
import { routerPush, router } from '../router/index'
import { ref } from 'vue';
import { useUserStore } from '../stores/user'
import { useClassroom } from '../composables/useClassroom'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { CONFIG } from '../config.js'

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const props = defineProps({
    slidesPerView: Number,
    centerAligned: Boolean,
    withButton: Boolean,
    slideHeight: String,
    navigation: Boolean
  });
const { setActiveClassroom, user, signOut, signIn } = useUserStore()
const { classroom, getList } = useClassroom();
console.log(classroom.list);
if(user.active.data.id){
  getList();
}

const activeItem = ref({});
const classroomSlider = ref(null);
const joinSlide = {
  id: 0,
  code: '',
  title: 'Join classroom'
}

const select = async (index) => {
  if(index !== false){
    activeItem.value = classroom.list[index];
    //classroomSlider.slideTo(index);
  } else {
    return routerPush('/classroom-join');
  }
  if(activeItem.value.code == user.active.authorization.classroom_code){
    return false;
  }
  const auth = {
    username: user.active.authorization.username,
    password: user.active.authorization.password,
    classroom_code: activeItem.value.code
  };
  await signIn(auth);
  return routerPush('/user-dashboard');
};

const onSwiper = (swiper) => {
  console.log('swiper')
  if(classroom.list[swiper.activeIndex]){
    activeItem.value = classroom.list[swiper.activeIndex];
  } else {
    activeItem.value = joinSlide;
  }
};
const onSlideChange = (swiper) => {
  if(classroom.list[swiper.activeIndex]){
    activeItem.value = classroom.list[swiper.activeIndex];
  } else {
    activeItem.value = joinSlide;
  }
};

</script>

<style>
.swiper-slide.swiper-slide-active,
.swiper-slide.swiper-slide-duplicate-active{
      transform: scale(1) !important;
}
.swiper-slide:not(.swiper-slide-active) {
  filter: grayscale(0.8) opacity(0.5);
}
</style>
  