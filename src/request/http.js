import axios from 'axios'
import { type } from '../../static/data'
// axios 配置
axios.defaults.timeout = 1 * 60 * 1000 * 10
axios.defaults.baseURL = `/${type}`
// axios.defaults.baseURL = 'http://159.226.194.34/'
// http request 拦截器
axios.interceptors.request.use(
  config => {
    // config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    if (config.method === 'get') {
      let time = new Date().getTime()
      if (config.url.indexOf('?') === -1) {
        config.url = config.url + `?time=${time}`
      } else {
        config.url = config.url + `&time=${time}`
      }
      config.url = encodeURI(config.url)
    }
    let authToken = null
    // console.log(authToken)
    if (authToken == null) {
      authToken = 'login'
    }
    config.headers.Authorization = `Bearer ` + authToken
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
            alert('您的登录已失效，请您重新登录')
            // store.store.commit(types.LOGOUT)
            // router.replace({
            //   path: 'login',
            //   query: {redirect: router.currentRoute.fullPath}
            // })
        }
      }
      // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
      return Promise.reject(error.response.data)
    })

export default axios
