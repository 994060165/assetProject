import axios from 'axios'
import querystring from 'querystring'

axios.defaults.baseURL = `/asset`
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// Add a request interceptor
axios.interceptors.request.use(config => {
  config.data = querystring.stringify(config.data)
  return config
}, error => {
  // Do something with request error
  return Promise.reject(error)
})

// // Add a response interceptor
// axios.interceptors.response.use(function (response) {
//   // Do something with response data
//   return response
// }, function (error) {
//   // Do something with response error
//   return Promise.reject(error)
// })
export default axios
