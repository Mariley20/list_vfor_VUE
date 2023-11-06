<template>
  <div class="d-flex align-center">
    <template v-if="showPriceLandedInput">
      <v-text-field
        v-model.number="companyFactorLanded"
        dense
        outlined
        hide-details
        style="max-width: 120px;"
        suffix="%"
        @change="handleChangeFactorLanded"
      />
      <v-btn
        icon
        width="24"
        height="24"
        color="success"
        @click="showPriceLandedInput = false"
      >
        <v-icon small>
          mdi-content-save-check
        </v-icon>
      </v-btn>
    </template>

    <span
      v-else
      class="ml-3 "
    >{{ companyFactorLanded }}%
      <v-btn
        icon
        width="24"
        height="24"
        color="primary"
        @click="showPriceLandedInput = true"
      >
        <v-icon small>mdi-pencil</v-icon>
      </v-btn>
    </span>
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
      companyFactorLanded: 0,
      showPriceLandedInput: false
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
  created () {
    this.companyFactorLanded = this.company.factor_landed > 0 ? this.company.factor_landed * 100 : 0
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

      this.showPriceLandedInput = false
    }
  }
}
</script>

<style lang="scss" scoped></style>
