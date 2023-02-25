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
        meta: { requiresAuth: true, bottomBarEnabled: true }
      },
      {
        path: 'course-:course_id',
        component: () => import('pages/CoursePage.vue'),
        meta: { requiresAuth: true, bottomBarEnabled: true }
      },
      {
        path: 'explore',
        component: () => import('pages/ExplorePage.vue'),
        meta: { requiresAuth: true, bottomBarEnabled: true }
      },
      {
        path: 'user',
        component: () => import('pages/UserDashboard.vue'),
        meta: {
          requiresAuth: true,
          bottomBarEnabled: true
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
          requiresAuth: true,
          transition: 'slide-in'
        }
      },
      {
        path: 'user/achievements',
        component: () => import('pages/UserAchievements.vue'),
        meta: {
          requiresAuth: true,
          transition: 'slide-in'
        }
      },

      {
        path: '/classrooms',
        component: () => import('pages/ClassroomsPage.vue'),
        meta: {
          requiresAuth: true,
          bottomBarEnabled: true
        }
      },
      {
        path: 'classroom',
        component: () => import('pages/ClassroomPage.vue'),
        meta: {
          requiresAuth: true,
          bottomBarEnabled: true
        }
      },
      {
        path: 'classroom-:classroom_id',
        component: () => import('pages/ClassroomPage.vue'),
        meta: {
          requiresAuth: true,
          bottomBarEnabled: true
        }
      },
      {
        path: 'classroom-:classroom_id/edit',
        component: () => import('pages/ClassroomEdit.vue'),
        meta: {
          requiresAuth: true,
          transition: 'slide-in'
        }
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
        path: 'classroom-:classroom_id/subscribers',
        component: () => import('pages/ClassroomSubscribers.vue'),
        meta: {
          requiresAuth: true,
          bottomBarEnabled: true,
          transition: 'slide-in'
        }
      },
      {
        path: 'classroom-:classroom_id/homeworks',
        component: () => import('pages/HomeworksPage.vue'),
        meta: {
          pageTitle: 'Homeworks',
          requiresAuth: true,
          transition: 'slide-in'
        }
      },
      {
        path: 'classroom-:classroom_id/homework-:homework_id',
        component: () => import('pages/HomeworkPage.vue'),
        meta: {
          pageTitle: 'Homework',
          requiresAuth: true,
          userGroups: ['registered', 'admin']
        }
      },
      {
        path: 'classroom/challenges',
        component: () => import('pages/ChallengesPage.vue'),
        meta: {
          pageTitle: 'Challenges',
          requiresAuth: true,
          transition: 'slide-in'
        }
      },
      {
        path: 'classroom-:classroom_id/challenges',
        component: () => import('pages/ChallengesPage.vue'),
        meta: {
          pageTitle: 'Challenges',
          requiresAuth: true,
          transition: 'slide-in'
        }
      },
      {
        path: 'classroom-:classroom_id/challenge-:challenge_id',
        component: () => import('pages/ChallengePage.vue'),
        meta: {
          pageTitle: 'Challenge',
          requiresAuth: true
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
        beforeEnter: checkIfSigned
      },
      {
        path: '/authorization/user-activate-:activation_code',
        component: () => import('pages/UserActivate.vue'),
        beforeEnter: checkIfSigned
      },
      {
        path: 'lesson-startup-:lesson_id',
        name: 'lesson-startup',
        component: () => import('pages/LessonStartup.vue')
      },
      {
        path: 'lesson-:lesson_id',
        name: 'lesson',
        component: () => import('src/pages/LessonItem.vue')
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
        path: 'classroom/homeworks',
        component: () => import('pages/HomeworksPage.vue'),
        meta: {
          pageTitle: 'Homeworks',
          requiresAuth: true,
          transition: 'slide-in'
        }
      },
      {
        path: 'leaderboard',
        component: () => import('pages/LeaderboardPage.vue'),
        meta: {
          requiresAuth: true,
          bottomBarEnabled: true
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
