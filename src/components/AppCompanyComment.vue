<template>
  <div>
    <v-textarea
      v-model="companyComment"
      dense
      hide-details
      outlined
      rows="1"
      @change="handleChangeComment"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    company: { type: Object, default: null }
  },
  data () {
    return {
      companyComment: ''
    }
  },
  methods: {
    ...mapActions({
      updatePartialCompanyData: 'licitacion/updatePartialCompanyData'
    }),
    handleChangeComment () {
      const companyId = this.company.id
      const data = {
        factor_landed: this.companyFactorLanded
      }

      this.updatePartialCompanyData({ companyId, data })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
