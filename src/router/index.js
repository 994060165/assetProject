import Vue from 'vue'
import VueRouter from 'vue-router'
// import sysRoutes from '@/system/router/index'
const login = r => require.ensure([], () => r(require('@/system/modules/login/login')), 'login')
const main = r => require.ensure([], () => r(require('@/views/main')), 'main')
const dashboard = r => require.ensure([], () => r(require('@/views/dashboard')), 'dashboard')
const assetSearch = r => require.ensure([], () => r(require('@/views/asset-search/index')), 'assetSearch')
const assetCheck = r => require.ensure([], () => r(require('@/views/asset-check/index')), 'assetCheck')
const assetPosition = r => require.ensure([], () => r(require('@/views/asset-position/index')), 'assetPosition')
const assetBind = r => require.ensure([], () => r(require('@/views/asset-bind/index')), 'assetBind')
const assetBindCheck = r => require.ensure([], () => r(require('@/views/asset-check/assetBindCheck')), 'assetBindCheck')

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/',
      name: 'main',
      component: main,
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: dashboard
        },
        {
          path: '/asset-search',
          name: 'asset-search',
          component: assetSearch
        },
        {
          path: '/asset-bind',
          name: 'asset-bind',
          component: assetBind
        },
        {
          path: '/asset-check',
          name: 'asset-check',
          component: assetCheck
        },
        {
          path: '/asset-bindcheck/:planId',
          name: 'assetBindCheck',
          component: assetBindCheck
        },
        {
          path: '/asset-position',
          name: 'asset-position',
          component: assetPosition
        }
      ]
    }
  ]
})

// router.beforeEach((to, from, next) => {
//   if (!store.getters.loggedIn && to.path !== '/login') {
//     next({
//       path: '/login',
//       query: {
//         redirect: to.fullPath
//       }
//     })
//   } else {
//     next()
//   }
// })

export default router
