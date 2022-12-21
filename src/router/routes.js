import MainLayout from 'layouts/MainLayout.vue'
import AuthorizationLayout from 'layouts/AuthorizationLayout.vue'
import EditLayout from 'layouts/EditLayout.vue'
import ClassroomLayout from 'layouts/ClassroomLayout.vue'
import ItemLayout from 'layouts/ItemLayout.vue'
import BasicLayout from 'layouts/BasicLayout.vue'
import UserLayout from 'layouts/UserLayout.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
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
      }
    ]
  },
  {
    path: '/',
    component: UserLayout,
    children: [
      {
        path: 'user',
        component: () => import('pages/UserDashboard.vue'),
        meta: {
          pageTitle: 'Profile',
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/',
    component: ClassroomLayout,
    children: [
      {
        path: 'classroom',
        component: () => import('pages/Classroom.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/',
    component: AuthorizationLayout,
    children: [
      {
        path: 'authorization',
        component: () => import('pages/UserStartup.vue')
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
        component: () => import('pages/UserSignIn.vue')
      },
      {
        path: 'authorization/sign-up',
        redirect: 'authorization/sign-up/step1'
      },
      {
        path: 'authorization/sign-up/step:step',
        component: () => import('pages/UserSignUp.vue')
      },
      {
        path: '/authorization/user-activate-:activation_code',
        component: () => import('pages/UserActivate.vue')
      }
    ]
  },
  {
    path: '/',
    component: EditLayout,
    children: [
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
      }
    ]
  },
  {
    path: '/',
    component: BasicLayout,
    children: [
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
