import axios from '../../../../service/http'
import { seedPrefix } from '../../../../service/app'

// 根据orgId获取部门人数
export const queryDirectOrgStaffCount = params => { return axios.post(`${seedPrefix}/organization/queryDirectOrgStaffCount/${params}`, {}).then(res => res.data) }
export const directories = params => { return axios.get(`${seedPrefix}/directories`).then(res => res.data) }
export const queryStaffAndOrgByUserIds = params => { return axios.post(`${seedPrefix}/staff/queryStaffAndOrgByUserIds`, params).then(res => res.data) }
