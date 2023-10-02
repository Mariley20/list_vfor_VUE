import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router/index'
// import store from './store'
import vuetify from '@/plugins/vuetify'

Vue.config.productionTip = false

// eslint-disable-next-line no-new
new Vue({
  router,
  // store,
  vuetify,
  ...App
})
