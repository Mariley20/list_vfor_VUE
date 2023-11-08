import {
  SET_LICITACION_DATA,
  SET_LICITACION_DETAILS,
  SET_PRODUCTS,
  SET_COMPANIES, ADD_COMPANY,
  UPDATE_PARTIAL_COMPANY_DATA,
  UPDATE_PARTIAL_PRODUCT_DATA,
  UPDATE_PARTIAL_LICITACION_DETAIL_DATA,
  ADD_LICITACION_DETAIL,
  UPDATE_LICITACION_DETAILS,
  DISABLE_LICITACION_DETAIL,
  MANUALLY_SELECT_LICITACION_DETAIL
} from '@/store/mutationTypes.js'

const state = () => ({
  licitacion: null,
  licitacionDetails: [],
  products: [],
  companies: []
})

const getters = {
  licitacionDetailIdsBestDeliveryDays: (state) => {
    const detailIds = []
    state.products.forEach(product => {
      const detailProduct = state.licitacionDetails
        .filter(detail => detail.producto_id === product.id && detail.dias_de_entrega > 0 && detail.price_landed > 0)
      if (detailProduct.length === 1) {
        detailIds.push(detailProduct[0])
      }
      if (detailProduct.length > 1) {
        const detailProductSorted = detailProduct.sort((a, b) => a.dias_de_entrega - b.dias_de_entrega)
        detailIds.push(detailProductSorted[0])
      }
    })
    return detailIds.map(item => item.id)
  },
  licitacionDetailsGroup: (state) => {
    const items = []
    state.products.forEach(product => {
      const licitacionDetails = state.licitacionDetails.filter(detail => detail.producto_id === product.id)
      items.push(licitacionDetails)
    })
    return items
  }
}
const actions = {
  setLicitacionData ({ commit }, { data }) {
    commit(SET_LICITACION_DATA, { data })
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
  disableLicitacionDetail ({ commit }, { licitacionDetailId, productId, disabled }) {
    commit(DISABLE_LICITACION_DETAIL, { licitacionDetailId, productId, disabled })
  },
  manuallySelectLicitacionDetail ({ commit }, { licitacionDetailId, productId, manually }) {
    commit(MANUALLY_SELECT_LICITACION_DETAIL, { licitacionDetailId, productId, manually })
  }
}

const mutations = {
  [SET_LICITACION_DATA] (state, { data }) {
    state.licitacion = data
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
  [DISABLE_LICITACION_DETAIL] (state, { licitacionDetailId, productId, disabled }) {
    this.commit('licitacion/UPDATE_PARTIAL_LICITACION_DETAIL_DATA', {
      licitacionDetailId,
      data: {
        better_price_landed: false,
        better_dias_de_entrega: false,
        disabled
      }
    })

    const productLicitacionDetails = state.licitacionDetails.filter(item => item.producto_id === productId && item.disabled === false)
    const sortedByPriceLanded = productLicitacionDetails
      .filter(item => item.price_landed > 0)
      .sort((a, b) => a.price_landed - b.price_landed)

    sortedByPriceLanded.forEach((item, i) => {
      const data = {
        better_price_landed: i === 0
      }
      this.commit('licitacion/UPDATE_PARTIAL_LICITACION_DETAIL_DATA', { licitacionDetailId: item.id, data })
    })
    const sortedByDiasDeEntrega = productLicitacionDetails
      .filter(item => item.dias_de_entrega > 0 && item.price_landed > 0)
      .sort((a, b) => a.dias_de_entrega - b.dias_de_entrega)
    sortedByDiasDeEntrega.forEach((item, i) => {
      const data = {
        better_dias_de_entrega: i === 0
      }
      this.commit('licitacion/UPDATE_PARTIAL_LICITACION_DETAIL_DATA', { licitacionDetailId: item.id, data })
    })
  },
  [MANUALLY_SELECT_LICITACION_DETAIL] (state, { licitacionDetailId, productId, manually }) {
    this.commit('licitacion/UPDATE_PARTIAL_LICITACION_DETAIL_DATA', {
      licitacionDetailId,
      data: {
        better_price_landed: manually,
        better_dias_de_entrega: manually,
        manually_selected: manually
      }
    })
    if (manually) {
      state.licitacionDetails.forEach(item => {
        if (item.producto_id === productId && item.id !== licitacionDetailId) {
          item.better_price_landed = false
          item.better_dias_de_entrega = false
          item.manually_selected = false
        }
      })
    } else {
      const productLicitacionDetails = state.licitacionDetails.filter(item => item.producto_id === productId)
      const sortedByPriceLanded = productLicitacionDetails
        .filter(item => item.price_landed > 0)
        .sort((a, b) => a.price_landed - b.price_landed)
      sortedByPriceLanded.forEach((item, i) => {
        const data = {
          better_price_landed: i === 0
        }
        this.commit('licitacion/UPDATE_PARTIAL_LICITACION_DETAIL_DATA', { licitacionDetailId: item.id, data })
      })
      const sortedByDiasDeEntrega = productLicitacionDetails
        .filter(item => item.dias_de_entrega > 0 && item.price_landed > 0)
        .sort((a, b) => a.dias_de_entrega - b.dias_de_entrega)
      sortedByDiasDeEntrega.forEach((item, i) => {
        const data = {
          better_dias_de_entrega: i === 0
        }
        this.commit('licitacion/UPDATE_PARTIAL_LICITACION_DETAIL_DATA', { licitacionDetailId: item.id, data })
      })
    }
  },
  [UPDATE_LICITACION_DETAILS] (state) {
    const detailsGroup = []
    state.products.forEach(product => {
      const licitacionDetails = state.licitacionDetails.filter(detail => detail.producto_id === product.id)
      detailsGroup.push(licitacionDetails)
    })

    detailsGroup.forEach(details => {
      const detailsAvailable = details.filter(item => item.disabled === false)
      const manuallyUnselected = details.every(item => item.manually_selected === false)
      if (manuallyUnselected) {
        const detailProductSorted = detailsAvailable.sort((a, b) => a.price_landed - b.price_landed)
        detailProductSorted.forEach((item, i) => {
          const data = {
            better_dias_de_entrega: i === 0
          }
          this.commit('UPDATE_PARTIAL_LICITACION_DETAIL_DATA', { licitacionDetailId: item.id, data })
        })

        const detailProductSorted2 = detailsAvailable.sort((a, b) => a.dias_de_entrega - b.dias_de_entrega)
        detailProductSorted2.forEach((item, i) => {
          const data = {
            better_price_landed: i === 0
          }
          this.commit('UPDATE_PARTIAL_LICITACION_DETAIL_DATA', { licitacionDetailId: item.id, data })
        })
      } else {
        detailsAvailable.forEach((item, i) => {
          const data = {
            better_price_landed: item.manually_selected,
            better_dias_de_entrega: item.manually_selected
          }
          this.commit('UPDATE_PARTIAL_LICITACION_DETAIL_DATA', { licitacionDetailId: item.id, data })
        })
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
