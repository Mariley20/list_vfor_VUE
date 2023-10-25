<template>
  <div class="d-flex align-center">
    <v-text-field
      v-model.number="companyFactorLanded"
      dense
      outlined
      hide-details
      style="max-width: 120px;"
      suffix="%"
      @change="handleChangeFactorLanded"
    />
    <span class="ml-3 grey--text">{{ companyFactorLanded }}%</span>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: {
    company: { type: Object, default: null }
  },
  data () {
    return {
      companyFactorLanded: 0
    }
  },
  computed: {
    ...mapState({
      licitacionDetails: (state) => state.licitacion.licitacionDetails
    }),
    companyLicitacionDetails () {
      return this.licitacionDetails.filter(detail => detail.company_id === this.company.id)
    }
  },
  methods: {
    ...mapActions({
      updatePartialCompanyData: 'licitacion/updatePartialCompanyData',
      updatePartialLicitacionDetailData: 'licitacion/updatePartialLicitacionDetailData'
    }),
    handleChangeFactorLanded () {
      const companyId = this.company.id
      const data = {
        factor_landed: this.companyFactorLanded / 100
      }

      this.updatePartialCompanyData({ companyId, data })

      this.companyLicitacionDetails.forEach(detail => {
        const data = {
          price_landed: Math.round((detail.price + (detail.price * (this.companyFactorLanded / 100))) * 100) / 100
        }

        this.updatePartialLicitacionDetailData({ licitacionDetailId: detail.id, data })
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
