
import axios from '@/request/index'
let seedPrefix = ''
// 人员管理列表
export const getpersonnel = params => { return axios.post(`${seedPrefix}/staff/queryStaffsByPage?${params}`, {}).then(res => res) }
// 人员信息查看
export const queryStaffById = params => { return axios.post(`${seedPrefix}/staff/queryStaffById`, params).then(res => res.data) }
// 修改人员信息
export const updateEntity = params => { return axios.post(`${seedPrefix}/staff/updateEntity`, params).then(res => res.data) }
// 删除
export const deleteByIds = params => { return axios.post(`${seedPrefix}/staff/deleteByIds`, params).then(res => res.data) }
// 新建
export const saveStaffInfo = params => { return axios.post(`${seedPrefix}/staff/saveStaffInfo`, params).then(res => res.data) }
// 获取登录信息
export const queryLoginByUserId = params => { return axios.post(`${seedPrefix}/login/queryLoginByUserId`, params).then(res => res.data) }
// 重置密码
export const resetPsw = params => { return axios.post(`${seedPrefix}/login/resetPsw`, params).then(res => res.data) }
// 配置角色
export const queryRolesByUserId = params => { return axios.get(`${seedPrefix}/staffRole/queryRolesByUserId/${params}`, params).then(res => res.data) }
// 配置角色seed/api/role/queryAllRolesByPage?queryKey=&page=1&pageSize=10&orderKey=
export const queryAllRolesByPage = params => { return axios.get(`${seedPrefix}/role/queryAllRolesByPage/${params}`).then(res => res.data) }
export const deleteStaffRolesByUserIdRoleIds = params => { return axios.post(`${seedPrefix}/staffRole/deleteStaffRolesByUserIdRoleIds`, params).then(res => res.data) }
export const addUserToRole = params => { return axios.post(`${seedPrefix}/staffRole/saveStaffRoles`, params).then(res => res.data) }
// export const addUserToRole = params => { return axios.post(`${seedPrefix}/staffRole/saveStaffRoles`, params).then(res => res.data) }
export const queryUserNotInRole = params => { return axios.get(`${seedPrefix}/staffRole/queryPartStaffByRoleId/${params.roleId}?page=${params.page}&pageSize=${params.pageSize}&queryKey=${params.queryKey}`).then(res => res) }
export const queryPartStaffRolesByUserId = params => { return axios.post(`${seedPrefix}/staffRole/queryPartStaffRolesByUserId?orderKey=&page=${params.page}&pageSize=${params.pageSize}&queryKey=${params.queryKey}`, params).then(res => res) }
