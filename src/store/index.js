import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import auth from './modules/auth'
import asset from './modules/asset'

Vue.use(Vuex)

export default new Vuex.Store({
  getters,
  actions,
  modules: {
    auth,
    asset
  }
})
