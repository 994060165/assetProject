import * as types from '../mutation-types'

const state = {
  all: [],
  deparments: [],
  persons: [],
  checks: []
}

const getters = {
  allAssets: state => state.all,
  allDeparments: state => state.deparments,
  allPersons: state => state.persons,
  allChecks: state => state.checks
}

const mutations = {
  [types.RECEIVE_ASSETLIST] (state, {
    assets
  }) {
    state.all = assets
  },
  [types.RECEIVE_ASSETLOCATION] (state, {
    locationHis,
    payload
  }) {
    state.all.find(a => a.asset_id === payload).locationHis = locationHis
  },
  [types.RECEIVE_DEPARMENTTLIST] (state, deparment) {
    state.deparments = deparment
  },
  [types.RECEIVE_PERSONTLIST] (state, person) {
    state.persons = person
  },
  [types.RECEIVE_CHECKLIST] (state, {
    checks
  }) {
    state.checks = checks
  }
}

export default {
  state,
  getters,
  mutations
}
