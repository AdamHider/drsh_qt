import MainLayout from 'layouts/MainLayout.vue'

import CoursePage from 'pages/CoursePage.vue'
import LeaderboardPage from 'pages/LeaderboardPage.vue'
import NotificationsPage from 'pages/NotificationsPage.vue'
import ExplorePage from 'pages/ExplorePage.vue'
import ExploreCourseSection from 'src/pages/ExploreCourseSection.vue'
import UserDashboard from 'pages/UserDashboard.vue'
import UserEdit from 'pages/UserEdit.vue'
import UserEditPassword from 'pages/UserEditPassword.vue'

import UserSettings from 'pages/UserSettings.vue'
import UserEmailVerification from 'pages/UserEmailVerification.vue'
import UserPasswordReset from 'pages/UserPasswordReset.vue'


import AchievementsPage from 'pages/AchievementsPage.vue'
import SkillsPage from 'pages/SkillsPage.vue'
import UserStartup from 'pages/UserStartup.vue'
import UserSignIn from 'pages/UserSignIn.vue'
import UserSignUp from 'pages/UserSignUp.vue'
import LessonStartup from 'pages/LessonStartup.vue'
import LessonFinish from 'pages/LessonFinish.vue'
import LessonItem from 'pages/LessonItem.vue'
import UserInvitation from 'pages/UserInvitation.vue'
import MarketPage from 'pages/MarketPage.vue'
import PaymentsPage from 'pages/PaymentsPage.vue'
import ErrorNotFound from 'pages/ErrorNotFound.vue'

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
    redirect: '/user',
    children: [
      {
        path: 'courses',
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
        path: 'leaderboard',
        name: 'leaderboard',
        component: LeaderboardPage,
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
        path: 'explore',
        name: 'explore',
        component: ExplorePage,
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
        path: 'notifications',
        name: 'notifications',
        component: NotificationsPage,
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
        path: 'user',
        name: 'user',
        component: UserDashboard,
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
        component: UserEdit,
        meta: {
          requiresAuth: true,
          transition: 'slide-in'
        }
      },
      {
        path: 'user/edit/password',
        component: UserEditPassword,
        meta: {
          requiresAuth: true,
          transition: 'slide-in'
        }
      },
      {
        path: 'user/settings',
        component: UserSettings,
        meta: {
          level: 2,
          requiresAuth: true,
          transition: 'slide-in'
        }
      },
      {
        path: '/achievements',
        component: AchievementsPage,
        meta: {
          level: 2,
          requiresAuth: true,
          transition: 'slide-in'
        }
      },
      {
        path: '/skills',
        component: SkillsPage,
        meta: {
          requiresAuth: true,
          bottomBarEnabled: true,
          transition: 'slide-in'
        }
      },

      {
        path: 'authorization',
        component: UserStartup,
        meta: { noBottomBar: true },
        beforeEnter: checkIfSigned
      },
      {
        path: 'authorization/sign-in',
        name: 'sign-in',
        component: UserSignIn,
        meta: { noBottomBar: true },
        beforeEnter: checkIfSigned
      },
      {
        path: 'authorization/sign-up',
        name: 'sign-up',
        component: UserSignUp,
        beforeEnter: checkIfSigned
      },
      {
        path: 'authorization/sign-up-:inviter_hash',
        name: 'sign-up-invited',
        component: UserSignUp,
        beforeEnter: checkIfSigned
      },
      {
        path: 'lesson-startup-:lesson_id',
        name: 'lesson-startup',
        component: LessonStartup,
      },
      {
        path: 'lesson-finish-:lesson_id',
        component: LessonFinish
      },
      {
        path: 'lesson-:lesson_id',
        component: LessonItem
      },
      {
        path: 'user-invitation-:inviter_hash',
        component: UserInvitation,
        beforeEnter: (to, from) => {
          const { user } = useUserStore()
          if (!user.active.data.id) {
            return { path: `/authorization/sign-up-${to.params.inviter_hash}` }
          }
        }
      },
      {
        path: 'email-verification-:verification_hash',
        component: UserEmailVerification
      },
      {
        path: 'authorization/password-reset-:reset_hash',
        name: 'password-reset',
        component: UserPasswordReset
      },
      {
        path: 'market',
        component: MarketPage,
        meta: { noBottomBar: true }
      },
      {
        path: 'payments',
        component: PaymentsPage,
        meta: { noBottomBar: true }
      },
      {
        path: 'explore-section-:course_section_id',
        name: 'explore-section',
        component: ExploreCourseSection,
        meta: { noBottomBar: true }
      },

    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: ErrorNotFound
  }
]

export default routes
