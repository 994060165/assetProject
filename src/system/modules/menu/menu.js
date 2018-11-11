import axios from '../../../../../../service/http'
import { seedPrefix } from '../../../../../../service/app'
export const getMenuID = params => { return axios.post(`${seedPrefix}/funMenu/queryFunMenusByDeptAndMenuID`, params).then(res => res.data) }
    //  更新
export const updateEntity = params => { return axios.post(`${seedPrefix}/funMenu/updateEntity`, params).then(res => res.data) }
    //  新建
export const saveFunMenu = params => { return axios.post(`${seedPrefix}/funMenu/saveFunMenu`, params).then(res => res.data) }
//  删除
export const delFunMenu = params => { return axios.get(`${seedPrefix}/funMenu/deleteFunMenuByIds/${params}`).then(res => res.data) }
