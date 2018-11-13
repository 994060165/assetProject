import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import 'babel-polyfill'
import router from './router'
import store from './store'
import moment from 'moment'
import Request from './request'
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

Vue.config.productionTip = false

Vue.use(Element)
Vue.prototype.$request = Request

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
