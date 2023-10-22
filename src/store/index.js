import Vue from 'vue'
import Vuex from 'vuex'
import app from '@/store/modules/app'
import licitacion from '@/store/modules/licitacion'

Vue.use(Vuex)

export default new Vuex.Store(
  {
    modules: {
      app,
      licitacion
    }
  }
)
