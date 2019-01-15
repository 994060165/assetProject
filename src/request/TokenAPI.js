import axios from './index'

export class TokenAPI {
  constructor () {
    this.baseUrl = '/seed/api/tokens'
  }
  findMine () {
    return axios.get(`${this.baseUrl}/mine`)
  }
  findAll (token) {
    return axios.get(`${this.baseUrl}/${token}/all`)
  }
  refresh (refreshToken) {
    return axios.put(`${this.baseUrl}/${refreshToken}`)
  }
  find (token) {
    return axios.get(`${this.baseUrl}/${token}`)
  }
  static getToken () {
    let token = sessionStorage.getItem('token')
    return token
  }
  static getStaff () {
    let staff = JSON.parse(sessionStorage.getItem('user'))
    return staff
  }
  static getOrg () {
    if (sessionStorage.getItem('org')) {
      let org = JSON.parse(sessionStorage.getItem('org'))
      return org
    } else {
      return null
    }
  }
}
