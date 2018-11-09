import * as types from './mutation-types'
import api from '../api'

export const login = async({
  commit,
  state
}, payload) => {
  const response = await api.login({
    ...payload
  })
  commit(types.AUTH_LOGIN, response.data)
  return response.data
}

export const logout = ({
  commit
}) => {
  commit(types.AUTH_LOGOUT)
}

export const getAssetList = async({
  commit,
  state
}) => {
  const response = await api.getAssetList()
  commit(types.RECEIVE_ASSETLIST, response.data)
  return response.data
}

export const getAssetLocation = async({
  commit,
  state
}, payload) => {
  const asset = state.asset.all.find(a => a.asset_id === payload)
  if (asset.locationHis === undefined) {
    let response = await api.getAssetLocation(payload)
    asset.locationHis = response.data.locationHis
    // commit(types.RECEIVE_ASSETLOCATION, {
    //   ...response.data,
    //   payload
    // })
    return response.data
  }
  return asset
}

export const getDeparmentList = async({
  commit,
  state
}) => {
  const response = await api.getDeparmentList()
  commit(types.RECEIVE_DEPARMENTTLIST, response.data['unique deparment'])
  return response.data
}

export const getPersonList = async({
  commit,
  state
}) => {
  const response = await api.getPersonList()
  commit(types.RECEIVE_PERSONTLIST, response.data['unique person'])
  return response.data
}

export const getCheckList = async({
  commit,
  state
}) => {
  const response = await api.getCheckList()
  commit(types.RECEIVE_CHECKLIST, response.data)
  return response.data
}
