import Vue from 'vue'
import VueRouter from 'vue-router'
import sysRoutes from '@/system/router/index'
import assetRoutes from '@/ewm/router/index'
const login = r => require.ensure([], () => r(require('@/system/modules/login/login')), 'login')
const translate = r => require.ensure([], () => r(require('@/system/modules/login/translate')), 'translate')
const main = r => require.ensure([], () => r(require('@/views/main')), 'main')
const dashboard = r => require.ensure([], () => r(require('@/views/dashboard')), 'dashboard')
const assetSearch = r => require.ensure([], () => r(require('@/views/asset-search/index')), 'assetSearch')
const assetSearchPerson = r => require.ensure([], () => r(require('@/views/asset-searchPerson/index')), 'assetSearchPerson')
const assetCheck = r => require.ensure([], () => r(require('@/views/asset-check/index')), 'assetCheck')
const assetPosition = r => require.ensure([], () => r(require('@/views/asset-position/index')), 'assetPosition')
const assetBind = r => require.ensure([], () => r(require('@/views/asset-bind/index')), 'assetBind')
// 部门管理员用
const assetBindTwo = r => require.ensure([], () => r(require('@/views/assetBindTwo/index')), 'assetBindTwo')
const assetUpload = r => require.ensure([], () => r(require('@/views/assetUpload/assetUploadAlls')), 'assetUploadAlls')
// 内部人员用
const assetBindSuper = r => require.ensure([], () => r(require('@/views/asset-bindSuper/index')), 'assetBindSuper')
const assetBindCheck = r => require.ensure([], () => r(require('@/views/asset-check/assetBindCheck')), 'assetBindCheck')
const assetTpl = r => require.ensure([], () => r(require('@/views/asset-template/index')), 'assetTpl')
const assetTpl2 = r => require.ensure([], () => r(require('@/views/assetTpl/index')), 'assetTpl2')
const assetMachine = r => require.ensure([], () => r(require('@/views/assetMachine/index')), 'assetMachine')
const imgAudit = r => require.ensure([], () => r(require('@/views/imgAudit/imgAudit')), 'imgAudit')

Vue.use(VueRouter)
let route = [
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
    path: '/translate/:token',
    name: 'translate',
    component: translate
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
        path: '/assetSearchPerson',
        name: 'assetSearchPerson',
        component: assetSearchPerson
      },
      {
        path: '/asset-bind',
        name: 'asset-bind',
        component: assetBind
      },
      {
        path: '/assetBindTwo',
        name: 'assetBindTwo',
        component: assetBindTwo
      },
      {
        path: '/assetBindSuper',
        name: 'assetBindSuper',
        component: assetBindSuper
      },
      {
        path: '/asset-check',
        name: 'asset-check',
        component: assetCheck
      },
      {
        path: '/assetUpload',
        name: 'assetUpload',
        component: assetUpload
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
      },
      {
        path: '/assetTpl',
        name: 'assetTpl',
        component: assetTpl
      },
      {
        path: '/assetTemplate',
        name: 'assetTemplate',
        component: assetTpl2
      },
      {
        path: '/assetMachine',
        name: 'assetMachine',
        component: assetMachine
      },
      {
        path: '/imgAudit',
        name: 'imgAudit',
        component: imgAudit
      }
    ]
  }
]
let allRoute = route.concat(sysRoutes).concat(assetRoutes)
const router = new VueRouter({
  routes: allRoute
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
