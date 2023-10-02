const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  // publicPath: process.env.NODE_ENV === 'production'
  //   ? '/my-souther_demo_vue/'
  //   : '/',
  pwa: {
    workboxOptions: {
      exclude: [/_redirects/]
    }
  }
})
