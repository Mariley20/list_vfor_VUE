<template>
  <div class="d-flex align-center">
    <v-text-field
      v-model.number="companyFactorLanded"
      dense
      outlined
      hide-details
      style="max-width: 120px;"
      @change="handleChangeFactorLanded"
    />
    <span class="ml-3">{{ companyFactorLanded }}%</span>
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
      companyFactorLanded: 0
    }
  },
  methods: {
    ...mapActions({
      updatePartialCompanyData: 'licitacion/updatePartialCompanyData'
    }),
    handleChangeFactorLanded () {
      const companyId = this.company.id
      const data = {
        factor_landed: this.companyFactorLanded / 100
      }

      this.updatePartialCompanyData({ companyId, data })
    }
  }
}
</script>

<style lang="scss" scoped></style>
