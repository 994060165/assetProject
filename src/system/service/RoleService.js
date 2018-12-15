import axios from '@/request/index'

let roleUrl = '/portal/role'
export class LocalRoleAPI {
  static findById (id) {
    return axios.get(`${roleUrl}/${id}`)
  }
  static list (query, page, pageSize, orderBy) {
    return axios.get(`/seed/api/role/queryAllRolesByPage?queryKey=${query}&page=${page}&pageSize=${pageSize}&orderKey=${orderBy}`)
  }
  static create (role) {
    return axios.post(`${roleUrl}`, role)
  }
  static update (role) {
    return axios.put(`${roleUrl}`, role)
  }
  static removeByIds (ids) {
    return axios.post(`${roleUrl}?m=delete`, ids)
  }
  static queryMembers (role, query, page, pageSize, orderBy) {
    return axios.get(`${roleUrl}/${role}/members?q=${query}&page=${page}&pageSize=${pageSize}&sort=${orderBy}`)
  }
  static removeMembers (role, userIds) {
    return axios.post(`${roleUrl}/${role}/members?m=delete`, userIds)
  }
  static addMembers (role, userIds) {
    return axios.post(`${roleUrl}/${role}/members`, userIds)
  }
  static findCandidates (role, query, page, pageSize, orderBy) {
    return axios.get(`${roleUrl}/${role}/members?candidates=true&q=${query}&page=${page}&pageSize=${pageSize}&sort=${orderBy}`)
  }
}
