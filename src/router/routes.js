import MainLayout from 'layouts/MainLayout.vue'
import AuthorizationLayout from 'layouts/AuthorizationLayout.vue'
import EditLayout from 'layouts/EditLayout.vue'
import BasicLayout from 'layouts/BasicLayout.vue'

const routes = [
  {
    path: '/',
    component: () => MainLayout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        component: () => import('pages/Home.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'lessons-:category_id',
        component: () => import('pages/Lessons.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'classroom',
        component: () => import('pages/Classroom.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'user',
        component: () => import('pages/UserDashboard.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/AuthorizationLayout.vue'),
    children: [
      {
        path: 'authorization',
        component: () => import('pages/UserStartup.vue'),
        meta: { noBottomBar: true }
      },
      {
        path: 'authorization/classroom-join',
        redirect: 'classroom-join/code=0'
      },
      {
        path: 'authorization/classroom-join/code=:code',
        component: () => import('pages/ClassroomJoin.vue'),
        meta: { noBottomBar: true }
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
      }
    ]
  },
  {
    path: '/',
    component: () => import('src/layouts/EditLayout.vue'),
    children: [
      {
        path: 'user/edit',
        component: () => import('pages/UserEdit.vue'),
        meta: { noBottomBar: true }
      },
      {
        path: 'user-password',
        component: () => import('pages/UserPasswordEdit.vue'),
        meta: { noBottomBar: true }
      },
      {
        path: 'user/settings',
        component: () => import('pages/Settings.vue'),
        meta: { noBottomBar: true }
      }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/BasicLayout.vue'),
    children: [
      {
        path: 'notifications',
        component: () => import('pages/Notifications.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'user/achievements',
        component: () => import('pages/UserAchievements.vue')
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
