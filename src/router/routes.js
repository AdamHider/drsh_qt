import MainLayout from 'layouts/MainLayout.vue'
import CoursePage from 'pages/CoursePage.vue'
import { useUserStore } from '../stores/user'
const checkIfSigned = function (to, from) {
  const { user } = useUserStore()
  if (user.active.data.id) {
    return { path: '/user' }
  }
}
const checkIfCharacterSelected = function (to, from) {
  const { user } = useUserStore()
  if (user.active.data.id && user.active.data.settings.characterId.value != 0) {
    return { path: '/user' }
  }
}
const routes = [
  {
    path: '/',
    component: MainLayout,
    redirect: '/user',
    children: [
      {
        path: 'course',
        name: 'course',
        component: CoursePage,
        meta: {
          level: 1,
          requiresAuth: true,
          bottomBarEnabled: true,
          transitionConfig: {
            leaderboard: 'slide-left',
            user: 'slide-left'
          }
        }
      },
      {
        path: 'courses',
        name: 'course',
        component: () => import('pages/CoursePage.vue'),
        meta: {
          level: 1,
          requiresAuth: true,
          bottomBarEnabled: true,
          transitionConfig: {
            leaderboard: 'slide-left',
            user: 'slide-left'
          }
        }
      },
      {
        path: 'leaderboard',
        name: 'leaderboard',
        component: () => import('pages/LeaderboardPage.vue'),
        meta: {
          level: 1,
          requiresAuth: true,
          bottomBarEnabled: true,
          transition: 'slide-in',
          transitionConfig: {
            course: 'slide-right',
            user: 'slide-left'
          }
        }
      },
      {
        path: 'user',
        name: 'user',
        component: () => import('pages/UserDashboard.vue'),
        meta: {
          level: 1,
          requiresAuth: true,
          bottomBarEnabled: true,
          transition: 'slide-out',
          transitionConfig: {
            course: 'slide-right',
            leaderboard: 'slide-right'
          }
        }
      },
      {
        path: 'user/edit',
        component: () => import('pages/UserEdit.vue'),
        meta: {
          requiresAuth: true,
          transition: 'slide-in'
        }
      },
      {
        path: 'user/edit/password',
        component: () => import('pages/UserEditPassword.vue'),
        meta: {
          requiresAuth: true,
          transition: 'slide-in'
        }
      },
      {
        path: 'user/settings',
        component: () => import('pages/UserSettings.vue'),
        meta: {
          level: 2,
          requiresAuth: true,
          transition: 'slide-in'
        }
      },
      {
        path: '/achievements',
        component: () => import('pages/AchievementsPage.vue'),
        meta: {
          level: 2,
          requiresAuth: true,
          transition: 'slide-in'
        }
      },
      {
        path: '/skills',
        component: () => import('pages/SkillsPage.vue'),
        meta: {
          requiresAuth: true,
          bottomBarEnabled: true,
          transition: 'slide-in'
        }
      },

      {
        path: 'authorization',
        component: () => import('pages/UserStartup.vue'),
        meta: { noBottomBar: true },
        beforeEnter: checkIfSigned
      },
      {
        path: 'authorization/sign-in',
        name: 'sign-in',
        component: () => import('pages/UserSignIn.vue'),
        meta: { noBottomBar: true },
        beforeEnter: checkIfSigned
      },
      {
        path: 'authorization/sign-up',
        name: 'sign-up',
        component: () => import('pages/UserSignUp.vue'),
        beforeEnter: checkIfSigned
      },
      {
        path: 'lesson-startup-:lesson_id',
        name: 'lesson-startup',
        component: () => import('pages/LessonStartup.vue'),
      },
      {
        path: 'lesson-finish-:lesson_id',
        component: () => import('pages/LessonFinish.vue')
      },
      {
        path: 'lesson-:lesson_id',
        component: () => import('src/pages/LessonItem.vue')
      },
      {
        path: 'character-select',
        component: () => import('pages/CharacterSelect.vue'),
        beforeEnter: checkIfCharacterSelected,
        meta: {
          pageTitle: 'CharacterSelect'
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
