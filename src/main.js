import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import store from './store'
import moment from 'moment'
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
import {
  sync
} from 'vuex-router-sync'
import {
  getDeparmentList,
  getPersonList
} from './store/actions'

Vue.config.productionTip = false

Vue.use(Element)

sync(store, router)
Vue.filter('moment', function (value, formatString) {
  formatString = formatString || 'YYYY-MM-DD'
  return moment(value).format(formatString)
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: {
    App
  }
})

getDeparmentList(store)
getPersonList(store)
