import MainLayout from 'layouts/MainLayout.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: 'course',
        component: () => import('pages/CoursePage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'explore',
        component: () => import('pages/ExplorePage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'user',
        component: () => import('pages/UserDashboard.vue'),
        meta: {
          pageTitle: 'Profile',
          requiresAuth: true
        }
      },
      {
        path: 'user/edit',
        component: () => import('pages/UserEdit.vue')
      },
      {
        path: 'user/edit/password',
        component: () => import('pages/UserEditPassword.vue')
      },
      {
        path: 'user/settings',
        component: () => import('pages/UserSettings.vue')
      },
      {
        path: 'authorization',
        component: () => import('pages/UserStartup.vue'),
        meta: { noBottomBar: true }
      },
      {
        path: 'classroom',
        component: () => import('pages/Classroom.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'classroom/join',
        redirect: 'classroom/join/code=0'
      },
      {
        path: 'classroom/join/code=:code',
        component: () => import('pages/ClassroomJoin.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'authorization/sign-in',
        component: () => import('pages/UserSignIn.vue'),
        meta: { noBottomBar: true }
      },
      {
        path: 'authorization/sign-up',
        redirect: 'authorization/sign-up/step1'
      },
      {
        path: 'authorization/sign-up/step:step',
        component: () => import('pages/UserSignUp.vue'),
        meta: { noBottomBar: true }
      },
      {
        path: '/authorization/user-activate-:activation_code',
        component: () => import('pages/UserActivate.vue'),
        meta: { noBottomBar: true }
      },
      {
        path: 'lesson-startup-:lesson_id',
        name: 'lesson-startup',
        component: () => import('pages/LessonStartup.vue'),
        meta: { noBottomBar: true }
      },
      {
        path: 'lesson-:lesson_id',
        name: 'lesson',
        component: () => import('src/pages/LessonItem.vue'),
        meta: { noBottomBar: true }
      },
      {
        path: 'notifications',
        component: () => import('pages/Notifications.vue'),
        meta: {
          pageTitle: 'Notifications',
          requiresAuth: true
        }
      },
      {
        path: 'user/achievements',
        component: () => import('pages/UserAchievements.vue'),
        meta: {
          pageTitle: 'Achievements',
          requiresAuth: true
        }
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
