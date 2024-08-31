import MainLayout from 'layouts/MainLayout.vue'
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
        component: () => import('pages/CoursePage.vue'),
        meta: {
          level: 1,
          requiresAuth: true,
          bottomBarEnabled: true,
          transitionConfig: {
            classroom_dashboard: 'slide-left',
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
            classroom_dashboard: 'slide-left',
            leaderboard: 'slide-left',
            user: 'slide-left'
          }
        }
      },
      {
        path: 'explore',
        component: () => import('pages/ExplorePage.vue'),
        meta: { requiresAuth: true, bottomBarEnabled: true }
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
            classroom_dashboard: 'slide-right',
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
            classroom_dashboard: 'slide-right',
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
        path: '/classrooms',
        component: () => import('pages/ClassroomsPage.vue'),
        meta: {
          requiresAuth: true,
          bottomBarEnabled: true
        }
      },
      {
        path: 'classroom-dashboard',
        name: 'classroom_dashboard',
        component: () => import('pages/ClassroomDashboardPage.vue'),
        meta: {
          requiresAuth: true,
          bottomBarEnabled: true,
          transitionConfig: {
            course: 'slide-right',
            leaderboard: 'slide-left',
            user: 'slide-left'
          }
        }
      },
      {
        path: 'classroom-:classroom_id',
        component: () => import('pages/ClassroomPage.vue'),
        meta: {
          requiresAuth: true,
          transition: 'slide-in'
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
        path: '/quests',
        component: () => import('pages/QuestsPage.vue'),
        meta: {
          requiresAuth: true,
          bottomBarEnabled: true,
          transition: 'slide-in'
        }
      },
      {
        path: 'quest-:quest_id',
        component: () => import('pages/QuestPage.vue'),
        meta: {
          pageTitle: 'Quest',
          requiresAuth: true,
          transition: 'slide-in'
        }
      },
      {
        path: 'quest-:quest_id/edit',
        component: () => import('pages/QuestEdit.vue'),
        meta: {
          pageTitle: 'Edit quest',
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
        redirect: 'authorization/sign-in/step1'
      },
      {
        path: 'authorization/sign-in/step:step',
        name: 'sign-in',
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
        name: 'sign-up',
        component: () => import('pages/UserSignUp.vue'),
        beforeEnter: checkIfSigned
      },
      {
        path: 'lesson-startup-:lesson_id',
        component: () => import('pages/LessonStartup.vue')
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
      },


      {
        path: 'admin/courses',
        component: () => import('pages/admin/LessonList.vue'),
        meta: {
          requiresAuth: true,
          transition: 'slide-in'
        }
      },
      {
        path: 'admin/course-sections',
        component: () => import('pages/admin/LessonList.vue'),
        meta: {
          requiresAuth: true,
          transition: 'slide-in'
        }
      },
      {
        path: 'admin/lessons',
        component: () => import('pages/admin/LessonList.vue'),
        meta: {
          requiresAuth: true,
          transition: 'slide-in'
        }
      },
      {
        path: 'admin/lesson-edit-:lesson_id',
        component: () => import('pages/admin/LessonEdit.vue'),
        meta: {
          requiresAuth: true,
          transition: 'slide-in'
        }
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
