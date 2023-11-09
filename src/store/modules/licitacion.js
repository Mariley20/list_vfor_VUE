import {
  SET_LICITACION_DATA,
  SET_LICITACION_DETAILS,
  SET_PRODUCTS,
  SET_COMPANIES, ADD_COMPANY,
  UPDATE_PARTIAL_COMPANY_DATA,
  UPDATE_PARTIAL_PRODUCT_DATA,
  UPDATE_PARTIAL_LICITACION_DETAIL_DATA,
  ADD_LICITACION_DETAIL,
  COMPARED_LICITACION_DETAILS,
  RESET_LICITACION_DETAILS,
  RESET_LICITACION_DETAILS_AVAILABLES,
  SET_HISTORICO_DATA
} from '@/store/mutationTypes.js'
import getLicitacionDetailsCompared from '@/helpers/getLicitacionDetailsCompared'
import getLicitacionDetailsComparedReset from '@/helpers/getLicitacionDetailsComparedReset'

const state = () => ({
  licitacion: null,
  licitacionDetails: [],
  products: [],
  companies: [],
  historico: []
})

const getters = {
}
const actions = {
  setLicitacionData ({ commit }, { data }) {
    commit(SET_LICITACION_DATA, { data })
  },
  setHistoricoData ({ commit }, { data }) {
    commit(SET_HISTORICO_DATA, { data })
  },
  setLicitacionDetails ({ commit }, { licitacionDetails }) {
    commit(SET_LICITACION_DETAILS, { licitacionDetails })
  },
  addLicitacionDetail ({ commit }, { licitacionDetail }) {
    commit(ADD_LICITACION_DETAIL, { licitacionDetail })
  },
  setProducts ({ commit }, { products }) {
    commit(SET_PRODUCTS, { products })
  },
  setCompanies ({ commit }, { data }) {
    commit(SET_COMPANIES, { data })
  },
  addCompany ({ commit }, { data }) {
    commit(ADD_COMPANY, { data })
  },
  updatePartialCompanyData ({ commit }, { companyId, data }) {
    commit(UPDATE_PARTIAL_COMPANY_DATA, { companyId, data })
  },
  updatePartialProductData ({ commit }, { productId, data }) {
    commit(UPDATE_PARTIAL_PRODUCT_DATA, { productId, data })
  },
  updatePartialLicitacionDetailData ({ commit, state }, { licitacionDetailId, data }) {
    commit(UPDATE_PARTIAL_LICITACION_DETAIL_DATA, { licitacionDetailId, data })
  },
  resetLicitacionDetails ({ commit }) {
    commit(RESET_LICITACION_DETAILS)
  },
  resetLicitacionDetailsAvailables ({ commit }) {
    commit(RESET_LICITACION_DETAILS_AVAILABLES)
  },
  disableLicitacionDetail ({ commit }, { licitacionDetailId, productId, disabled }) {
    commit(UPDATE_PARTIAL_LICITACION_DETAIL_DATA, {
      licitacionDetailId,
      data: {
        better_price_landed: false,
        better_dias_de_entrega: false,
        manually_selected: false,
        disabled
      }
    })
    commit(COMPARED_LICITACION_DETAILS)
  },
  manuallySelectLicitacionDetail ({ commit }, { licitacionDetailId, productId, manually }) {
    commit(UPDATE_PARTIAL_LICITACION_DETAIL_DATA, {
      licitacionDetailId,
      data: {
        better_price_landed: manually,
        better_dias_de_entrega: manually,
        manually_selected: manually,
        disabled: false
      }
    })
    commit(COMPARED_LICITACION_DETAILS)
  }
}

const mutations = {
  [SET_LICITACION_DATA] (state, { data }) {
    state.licitacion = data
  },
  [SET_HISTORICO_DATA] (state, { data }) {
    state.historico = data
  },
  [SET_LICITACION_DETAILS] (state, { licitacionDetails }) {
    state.licitacionDetails = licitacionDetails
  },
  [ADD_LICITACION_DETAIL] (state, { licitacionDetail }) {
    state.licitacionDetails.push(licitacionDetail)
  },
  [SET_PRODUCTS] (state, { products }) {
    state.products = products
  },
  [SET_COMPANIES] (state, { data }) {
    state.companies = data
  },
  [ADD_COMPANY] (state, { data }) {
    state.companies.push(data)
  },
  [UPDATE_PARTIAL_COMPANY_DATA] (state, { companyId, data }) {
    const companyIndex = state.companies.findIndex(company => company.id === companyId)
    for (const [key, value] of Object.entries(data)) {
      state.companies[companyIndex][key] = value
    }
  },
  [UPDATE_PARTIAL_PRODUCT_DATA] (state, { productId, data }) {
    const productIndex = state.products.findIndex(product => product.id === productId)
    for (const [key, value] of Object.entries(data)) {
      state.products[productIndex][key] = value
    }
  },
  [UPDATE_PARTIAL_LICITACION_DETAIL_DATA] (state, { licitacionDetailId, data }) {
    const licitacionDetailIndex = state.licitacionDetails.findIndex(licitacionDetail => licitacionDetail.id === licitacionDetailId)
    for (const [key, value] of Object.entries(data)) {
      state.licitacionDetails[licitacionDetailIndex][key] = value
    }
  },
  [COMPARED_LICITACION_DETAILS] (state) {
    state.licitacionDetails = getLicitacionDetailsCompared(state.licitacionDetails, state.products)
  },
  [RESET_LICITACION_DETAILS] (state) {
    state.licitacionDetails = getLicitacionDetailsComparedReset(state.licitacionDetails, state.products)
  },
  [RESET_LICITACION_DETAILS_AVAILABLES] (state) {
    const newlicitacionDetails = JSON.parse(JSON.stringify(state.licitacionDetails))
    newlicitacionDetails.forEach((element, i) => {
      newlicitacionDetails[i].better_dias_de_entrega = false
      newlicitacionDetails[i].better_price_landed = false
      newlicitacionDetails[i].manually_selected = false
    })
    state.licitacionDetails = getLicitacionDetailsCompared(newlicitacionDetails, state.products)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
