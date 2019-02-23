import axios from './resources'

/* eslint-disable camelcase */
export default {
  // AuthResource
  // login: function (payload) {
  //   return AuthResource.get({
  //     action: 'login',
  //     ...payload
  //   })
  // },
  /**
   * [getAssetList 获取资产列表]
   */
  getAssetList: ({page = 1, page_size = 15} = {}) => {
    return axios.get('../assets', {
      params: {page, page_size}
    })
  },
  getReportDataToEchar () {
    return axios.post('/res/index/getReportDataToEchar').then(res => res.data)
  },
  /**
   * [getAsset 根据asset_id查找特定资产]
   * @param {[type]} assetID [资产ID]
   */
  getAsset: assetID => {
    return axios.get(`../assets/${assetID}`)
  },
  /**
   * [fetchAssetList 筛选资产列表]
   * @param {[type]} payload [责任部门、责任人、领用日期范围、价值范围、任务ID、盘点标志]
   */
  fetchAssetList: (params) => {
    return axios.post('/res/index/getasset', params).then(res => res.data)
  },
  // 更新资产
  changeAsset: params => {
    return axios.post('/res/index/updateAssetForAdmin', params).then(res => res.data)
  },
  /**
   * [fetchAssetList 筛选资产列表]
   * @param {[type]} payload [责任部门、责任人、领用日期范围、价值范围、任务ID、盘点标志]
   */
  fetchCheckAssetList: payload => {
    return axios.post('/checkAssets', {
      ...payload
    })
  },
  /**
   * [gettagbindlike 模糊搜索]
   * @param {[type]} keyword [资产名称、资产标签号、品牌、型号、责任人]
   */
  gettagbindlike: (params) => {
    return axios.post(`/res/index/gettagbindlike`, params).then(res => res.data)
  },
  /**
   * [gettagbind 模糊搜索]
   * @param {[type]} keyword [资产名称、资产标签号、品牌、型号、责任人]
   */
  gettagbind: (params) => {
    return axios.post(`/res/index/gettagbind`, params).then(res => res.data)
  },
   /**
   * [searchAssetList 模糊搜索]
   * @param {[type]} keyword [资产名称、资产标签号、品牌、型号、责任人]
   */
  searchAssetList: (params) => {
    return axios.post(`/res/index/getassetlike`, params).then(res => res.data)
  },
  searchAssetListByZRR: (params) => {
    return axios.post(`/res/index/getassetlikeZRR`, params).then(res => res.data)
  },
  /**
   * [getAssetLocation 获取资产设备位置变化记录]
   * @param {[type]} assetID [资产ID]
   */
  getAssetLocation: assetID => {
    return axios.get(`/locationhis/${assetID}`)
  },
  /**
   * [getDeparmentList 部门列表]
   */
  getDeparmentList: () => {
    return axios.get('/deparment')
  },
  /**
   * [getPersonList 负责人列表]
   */
  getPersonList: () => {
    return axios.get('/person')
  },
  /**
   * [postCheck 新建盘点任务]
   * @param  {[type]} payload [description]
   */
  postCheck: params => {
    return axios.post('/res/index/putchecksplan', params).then(res => res.data)
  },
  /**
   * [getCheckList 查找盘点任务列表]
   * @param  {[finished]} payload [是否已完成]
   */
  getchecksplan: params => {
    return axios.post(`/res/index/getchecksplanAll`, params).then(res => res.data)
  },
  getAssetBase16: params => {
    return axios.post(`/res/index/getAssetBase16`, params).then(res => res.data)
  },
  deletechecksplanDetail: params => {
    return axios.post(`/res/index/deletechecksplanDetail`, params).then(res => res.data)
  },
  /**
   * [getPlanAssteList 查找盘点任务列表]
   * @param  {[finished]} payload [是否已完成]
   */
  getPlanAssteList: params => {
    return axios.post(`/res/index/getchecksplanDetailV2`, params).then(res => res.data)
  },
   /**
   * [getPlanWord 查找盘点任务列表]
   * @param  {[finished]} payload [是否已完成]
   */
  getPlanWord: params => {
    return axios.post(`/res/index/outputCheckRepot`, params).then(res => res.data)
  },
    /**
   * [getPlanWord 查找盘点任务列表]
   * @param  {[finished]} payload [是否已完成]
   */
  exportAssetToExcel: params => {
    return axios.post(`/res/index/exportAssetToExcel`, params).then(res => res.data)
  },
  /**
   * putcheckdetailAll
   * 盘点计划资产列表录入
   */
  putcheckdetailAll: params => {
    return axios.post(`/res/index/putcheckdetailAll`, params).then(res => res.data)
  },
  /**
   * [getLocationCount 获取位置设备统计]
   */
  getLocationCount: () => {
    return axios.get('/location')
  },
  /**
   * [getMessageList 获取位置变更通知]
   */
  getMessageList: () => {
    return axios.get('/messages')
  },
  /**
   * [deleteMessage 位置变更通知删除]
   * @param  {[type]} payload [资产ID]
   */
  deleteMessage: payload => {
    return axios.post('/messages', {
      ...payload
    })
  },
  getAssetImg (params) {
    return axios.post(`/res/index/getAssetImg`, params).then(res => res.data)
  },
  getAssetImgToBase64 (params) {
    return axios.post(`/res/index/getAssetImgToBase64`, params).then(res => res.data)
  }
}
