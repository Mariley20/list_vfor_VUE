<template>
  <v-container fluid>
    <AppPrintLicitacionFull />
  </v-container>
</template>

<script>

export default {
  name: 'AboutView',
  components: {
    AppPrintLicitacionFull: () => import('@/components/AppPrintLicitacionFull.vue')
  }
}

</script>
<style lang="scss" scoped>

</style>
