import MainLayout from 'layouts/MainLayout.vue'
import { useUserStore } from '../stores/user'
const checkIfSigned = function (to, from) {
  const { user } = useUserStore()
  if (user.active.data.id) {
    return { path: '/user' }
  }
}
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
        path: 'classroom',
        component: () => import('pages/ClassroomPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'classroom-:classroom_id',
        component: () => import('pages/ClassroomPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'classroom-:classroom_id/edit',
        component: () => import('pages/ClassroomEdit.vue'),
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
        path: 'authorization',
        component: () => import('pages/UserStartup.vue'),
        meta: { noBottomBar: true },
        beforeEnter: checkIfSigned
      },
      {
        path: 'authorization/sign-in',
        component: () => import('pages/UserSignIn.vue'),
        meta: { noBottomBar: true },
        beforeEnter: checkIfSigned
      },
      {
        path: 'authorization/sign-up',
        redirect: 'authorization/sign-up/step1'
      },
      {
        path: 'authorization/sign-up/step:step',
        component: () => import('pages/UserSignUp.vue'),
        meta: { noBottomBar: true },
        beforeEnter: checkIfSigned
      },
      {
        path: '/authorization/user-activate-:activation_code',
        component: () => import('pages/UserActivate.vue'),
        meta: { noBottomBar: true },
        beforeEnter: checkIfSigned
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
      },
      {
        path: 'classroom/challenges',
        component: () => import('pages/ChallengesPage.vue'),
        meta: {
          pageTitle: 'Challenges',
          requiresAuth: true
        }
      },
      {
        path: 'classroom-:classroom_id/challenges',
        component: () => import('pages/ChallengesPage.vue'),
        meta: {
          pageTitle: 'Challenges',
          requiresAuth: true
        }
      },
      {
        path: 'challenge-:challenge_id',
        component: () => import('pages/ChallengePage.vue'),
        meta: {
          pageTitle: 'Challenge',
          requiresAuth: true
        }
      },
      {
        path: 'classroom/homeworks',
        component: () => import('pages/HomeworksPage.vue'),
        meta: {
          pageTitle: 'Homeworks',
          requiresAuth: true
        }
      },
      {
        path: 'classroom-:classroom_id/homeworks',
        component: () => import('pages/HomeworksPage.vue'),
        meta: {
          pageTitle: 'Homeworks',
          requiresAuth: true
        }
      },
      {
        path: 'homework-:homework_id',
        component: () => import('pages/HomeworkPage.vue'),
        meta: {
          pageTitle: 'Homework',
          requiresAuth: true
        }
      },
      {
        path: 'leaderboard',
        component: () => import('pages/LeaderboardPage.vue'),
        meta: {
          pageTitle: 'Leaderboard',
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
