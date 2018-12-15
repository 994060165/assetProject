// 接口地址
import axios from 'axios'
import { type } from '../../static/data'
// axios 配置
axios.defaults.timeout = 120 * 1000
axios.defaults.baseURL = `/${type}`
// axios.defaults.baseURL = 'http://159.226.194.34/'
// http request 拦截器
axios.interceptors.request.use(
  config => {
    // config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    let authToken = window.sessionStorage.getItem('token')
    if (config.method === 'get') {
      let time = new Date().getTime()
      if (config.url.indexOf('?') === -1) {
        config.url = config.url + `?time=${time}&token=${authToken}`
      } else {
        config.url = config.url + `&time=${time}&token=${authToken}`
      }
      config.url = encodeURI(config.url)
    }
    if (authToken == null) {
      authToken = 'login'
    }
    config.headers.token = authToken
    return config
  },
  err => {
    return Promise.reject(err)
  })

// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
      }
    }
    return Promise.reject(error.response.data)
  })

export default {
  get: function (path) {
    return axios.get(encodeURI(path))
  },
  post: function (path, params) {
    return axios.post(path, params)
  },
  put: function (path, params) {
    return axios.put(path, params)
  },
  delete: function (path, params) {
    return axios.delete(path, params)
  }
}
