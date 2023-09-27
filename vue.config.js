const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production'
    ? '/my-souther_demo_vue/'
    : '/',
  transpileDependencies: [
    'vuetify'
  ]
})
