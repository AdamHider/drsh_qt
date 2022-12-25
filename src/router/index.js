import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { useUserStore } from '../stores/user'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

window.popStateDetected = false
window.addEventListener('popstate', () => {
  window.popStateDetected = true
})

const routerHistory = {
  stack: []
}

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior (to, from, savedPosition) {
    },
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach((to, from, next) => {
    /*
    const IsItABackButton = window.popStateDetected
    window.popStateDetected = false
    const isRoot = from.fullPath.split('/').length == 2;

    if(isRoot && to.fullPath == routerHistory.stack[1] && !IsItABackButton){
      routerHistory.stack.shift();
      Router.go(-1);
    }

      if(!isRoot && IsItABackButton){
        routerHistory.stack[0] = to.fullPath;
        next({ path: '/'+from.fullPath.split('/')[1] });
      }
      */

    if (to.matched.some(record => record.meta.requiresAuth)) {
      // this route requires auth, check if logged in
      // if not, redirect to login page.
      const { user } = useUserStore()
      if (!user.active.data.id) {
        next({ path: '/authorization' })
      } else {
        next() // go to wherever I'm going
      }
    } else {
      next() // does not require auth, make sure to always call next()!
    }
    /*
      routerHistory.stack.unshift(to.fullPath);
      if(routerHistory.stack.length > 10){
        routerHistory.stack.pop();
      } */
  })

  return Router
})
