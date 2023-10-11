import { SET_HISTORICAL_DATA } from '@/store/mutationTypes.js'

const state = () => ({
  historicalData: []
})

const getters = { }
const actions = {
  setHistoricalData ({ commit }, { data }) {
    commit(SET_HISTORICAL_DATA, { data })
  }
}

const mutations = {
  [SET_HISTORICAL_DATA] (state, { data }) {
    state.historicalData = data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
