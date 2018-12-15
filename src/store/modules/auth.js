import * as types from '../mutation-types'

const state = {
  user: JSON.parse(window.sessionStorage.getItem('backstage_auth_user')),
  menu: [
    {
      name: '资产总览',
      icon: 'view',
      path: '/dashboard'
    },
    {
      name: '资产查询',
      icon: 'search',
      path: '/asset-search'
    },
    {
      name: '标签打印',
      icon: 'printer',
      path: '/asset-bind'
    },
    {
      name: '盘点计划',
      icon: 'edit',
      path: '/asset-check'
    },
    {
      name: '设备管理',
      icon: 'setting',
      path: '/assetMachine'
    },
    {
      name: '模板管理',
      icon: 'tickets',
      path: '/assetTpl'
    }
  ]
}

const getters = {
  currentUser: state => state.user,
  currentMenu: state => state.menu
}

const mutations = {
  [types.AUTH_LOGIN] (state, {
    user
  }) {
    state.user = user
    window.sessionStorage.setItem('backstage_auth_user', JSON.stringify(user))
  },
  [types.AUTH_LOGOUT] (state) {
    state.user = null
    window.sessionStorage.removeItem('backstage_auth_user')
  }
}

export default {
  state,
  getters,
  mutations
}
