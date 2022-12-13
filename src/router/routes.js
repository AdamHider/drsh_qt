
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('pages/Home.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/lessons-:category_id',
        component: () => import('pages/Lessons.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/classroom',
        component: () => import('pages/Classroom.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/classroom-join',
        redirect: '/classroom-join/code=0'
      },
      {
        path: '/classroom-join/code=:code',
        component: () => import('pages/ClassroomJoin.vue'),
        meta: { noBottomBar: true }
      },
      {
        path: '/notifications',
        component: () => import('pages/Notifications.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/user-dashboard',
        component: () => import('pages/UserDashboard.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/user-startup',
        component: () => import('pages/UserStartup.vue'),
        meta: { noBottomBar: true }
      },
      {
        path: '/user-sign-in',
        redirect: '/user-sign-in/step1'
      },
      {
        path: '/user-sign-in/step:step',
        name: 'user-sign-in',
        component: () => import('pages/UserSignIn.vue'),
        meta: { noBottomBar: true }
      },
      {
        path: '/user-sign-up',
        redirect: '/user-sign-up/step1'
      },
      {
        path: '/user-sign-up/step:step',
        name: 'user-sign-up',
        component: () => import('pages/UserSignUp.vue'),
        meta: { noBottomBar: true }
      },
      {
        path: '/user-activate-:activation_code',
        component: () => import('pages/UserActivate.vue'),
        meta: { noBottomBar: true }
      },
      {
        path: '/user-edit',
        component: () => import('pages/UserEdit.vue'),
        meta: { noBottomBar: true }
      },
      {
        path: '/user-password-edit',
        component: () => import('pages/UserPasswordEdit.vue'),
        meta: { noBottomBar: true }
      },
      {
        path: '/user-achievements',
        component: () => import('pages/UserAchievements.vue'),
        meta: { noBottomBar: true }
      },
      {
        path: '/settings',
        component: () => import('pages/Settings.vue'),
        meta: { noBottomBar: true }
      },
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
