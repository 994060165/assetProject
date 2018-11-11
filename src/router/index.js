import Vue from 'vue'
import VueRouter from 'vue-router'
import main from '@/views/main'
import dashboard from '@/views/dashboard'
import assetSearch from '@/views/asset-search/index'
import assetCheck from '@/views/asset-check/index'
import assetPosition from '@/views/asset-position/index'
import assetBind from '@/views/asset-bind/index'
import assetBindCheck from '@/views/asset-check/assetBindCheck'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
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
