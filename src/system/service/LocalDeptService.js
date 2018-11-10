import axios from '../../../../../service/http'

export class LocalDeptAPI {
  static findByIds (ids) {
    return axios.post(`/portal/dept?m=get`, ids)
  }
  static list (query, page, pageSize, sort) {
    return axios.get(`/portal/dept?q=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}&sort=${sort}`)
  }
  static removeAll (ids) {
    return axios.post(`/portal/dept?m=delete`, ids)
  }
  static update (dept) {
    return axios.put(`/porta/dept/${dept.id}`, dept)
  }
  static create (dept) {
    return axios.post(`/portal/dept`, dept)
  }
  static removeMember (orgId, userId) {
    return axios.delete(`/portal/dept/${orgId}/members/${userId}`)
  }
  static countMembers (orgId) {
    return axios.get(`/portal/dept/${orgId}/members/count`)
  }
  static countMyDeptMembers () {
    return axios.get(`/portal/dept/mydept/members/count?withSubDept=true`)
  }
  static countMembersWithOrgIds (orgIds) {
    return axios.post('/portal/dept/-1/members/count?m=get', orgIds)
  }
  static countMembersWithSubDept (orgId) {
    return axios.get(`/portal/dept/${orgId}/members/count?withSubDept=true`)
  }
  static addMembers (orgId, userIds) {
    return axios.post(`/porta/dept/${orgId}/members`, userIds)
  }
  static listMembersWithSubDept (orgId, query, page, pageSize, sort) {
    return axios.get(`/portal/dept/${orgId}/members?includeSubDepts=true&page=${page}&pageSize=${pageSize}&q=${encodeURIComponent(query)}&sort=${sort}`)
  }
  static listMembers (orgId) {
    return axios.get(`/portal/dept/${orgId}/members`)
  }
  static findChildrenCandidates (orgId, page, pageSize, query) {
    return axios.get(`/portal/dept/${orgId}/children?candidates=true&page=${page}&pageSize=${pageSize}&q=${encodeURIComponent(query)}`)
  }
  // 查询下级机构接口
  static findChildren (orgId) {
    return axios.get(`/portal/dept/${orgId}/children`)
  }
  // 删除部门接口
  static removeChild (father, child) {
    return axios.delete(`/portal/dept/${father}/children/${child}`)
  }
  // 添加人员接口
  static addChildren (orgId, children) {
    return axios.post(`/portal/dept/${orgId}/members`, children)
  }
  // 更新人员接口
  static updateUser (orgId, userInfo) {
    return axios.put(`/portal/dept/${orgId}/members`, userInfo)
  }
  // 修改机构信息接口
  static editDeptInfo (orgId, deptInfo) {
    return axios.put(`/portal/dept/${orgId}`, deptInfo)
  }
  static findById (orgId) {
    return axios.get(`/portal/dept/${orgId}`)
  }
  /* 分割线 */
  // 查询全部部门接口
  static findAllDept () {
    return axios.get(`/seed/api/dept/queryDepts`).then(res => res.data)
  }
  // 新增部门接口
  static addDept (deptInfo) {
    return axios.post(`/seed/api/dept/saveDept`, deptInfo).then(res => res.data)
  }
  // 更新部门信息接口
  static updateDeptInfo (deptInfo) {
    return axios.post(`/seed/api/dept/updateDept`, deptInfo).then(res => res.data)
  }
  // 删除部门
  static deleteDept (deptid) {
    return axios.delete(`/seed/api/dept/deleteById/${deptid}`).then(res => res.data)
  }
  // 根据id查询部门信息
  static findDeptById (deptid) {
    return axios.get(`/seed/api/dept/queryEntity/${deptid}`).then(res => res.data)
  }
  // 增加部门成员
  static addDeptPerson (params) {
    return axios.post(`/seed/api/staffOrg/saveEntity`, params).then(res => res.data)
  }
  // 删除人员接口
  static deleteDeptPerson (params) {
    return axios.post(`/seed/api/staffOrg/deleteUser`, params).then(res => res.data)
  }
  // 查询机构下所有人员
  static getDeptPerson (orgId, page) {
    return axios.get(`/seed/api/staffOrg/queryUsers/${orgId}?page=${page.page}&pageSize=${page.pageSize}&queryKey=`).then(res => res)
  }
}
