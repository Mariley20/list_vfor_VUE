<template>
  <div
    class="licitacion-detail-item"
    :class="{ 'licitacion-detail-item__hide-products': !showProductName }"
  >
    <div
      v-if="showProductName"
      class="font-weight-bold"
      style="line-height: normal;"
    >
      {{ licitacionDetail.product_name }}
    </div>
    <div :class="deliveryDaysClass">
      {{ licitacionDetail.dias_de_entrega }}
    </div>
    <div>{{ licitacionDetail.price * licitacionDetail.cantidad }}</div>
    <div>
      <!-- <v-text-field
        v-model.number="companyPriceNeto"
        dense
        outlined
        hide-details
        class="mr-2"
        style="min-width: 60px;"
      /> -->
      <div class="d-flex align-center">
        <input
          v-model.number="companyPriceNeto"
          type="number"
          class="price-input"
          @change="handlePriceNeto"
        >
        {{ licitacionDetail.price }}
      </div>
    </div>
    <div :class="priceLandedClass">
      {{ licitacionDetail.price_landed }}
    </div>
    <div>{{ licitacionDetail.cantidad }}</div>
    <div>
      <input
        v-model="checked"
        type="checkbox"
        @change="handleCheckboxClick($event)"
      >
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import getLicitacionDetailsCompared from '@/helpers/getLicitacionDetailsCompared'
import getLicitacionDetailsCheckedManual from '@/helpers/getLicitacionDetailsCheckedManual'

export default {
  props: {
    company: { type: Object, default: null },
    licitacionDetail: { type: Object, default: null },
    licitacionDetailIndex: { type: Number, default: 0 },
    companyIndex: { type: Number, default: 0 }
  },
  data () {
    return {
      companyPriceNeto: 0,
      checked: false
    }
  },
  computed: {
    ...mapState({
      licitacionDetails: (state) => state.licitacion.licitacionDetails,
      products: (state) => state.licitacion.products
    }),
    ...mapGetters({
      licitacionDetailIdsBestDeliveryDays: 'licitacion/licitacionDetailIdsBestDeliveryDays'
    }),

    showProductName () {
      return this.companyIndex === 0
    },
    companyFactorLanded () {
      return this.company.factor_landed
    },
    priceLandedClass () {
      if (this.licitacionDetail.better_price_landed) {
        return 'success'
      }
      return null
    },
    deliveryDaysClass () {
      if (this.licitacionDetail.better_dias_de_entrega) {
        return 'warning'
      }
      return null
    }
  },
  watch: {
    licitacionDetail: {
      immediate: false,
      deep: true,
      handler (newValue) {
        this.checked = this.licitacionDetail.better_dias_de_entrega && this.licitacionDetail.better_price_landed
      }
    }
  },
  mounted () {
    this.companyPriceNeto = this.licitacionDetail.price
  },
  methods: {
    ...mapActions({
      updatePartialLicitacionDetailData: 'licitacion/updatePartialLicitacionDetailData',
      setLicitacionDetails: 'licitacion/setLicitacionDetails'
    }),
    handleCheckboxClick (event) {
      if (event.target.checked) {
        const licitacionDetails = getLicitacionDetailsCheckedManual(this.licitacionDetails, this.licitacionDetail.uuid)
        this.setLicitacionDetails({ licitacionDetails })
      } else {
        const licitacionDetails = getLicitacionDetailsCompared(this.licitacionDetails, this.products)
        this.setLicitacionDetails({ licitacionDetails })
      }
    },
    handlePriceNeto () {
      const data = {
        price: this.companyPriceNeto,
        price_landed: Math.round((this.companyPriceNeto + (this.companyPriceNeto * (this.companyFactorLanded / 100))) * 100) / 100
      }
      this.updatePartialLicitacionDetailData({
        licitacionDetailId: this.licitacionDetail.id,
        data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.licitacion-detail-item {
  display: grid;
  text-align: center;
  grid-template-columns: 110px 60px 60px 110px repeat(2, 60px) 30px;
  // border: 1px solid rgb(228, 228, 228);

  &>div {
    padding: 4px;
    align-self: stretch;
    border-left: 1px solid #ddd;
    border-top: 1px solid #ddd;
  }

  &__hide-products {
    grid-template-columns: 60px 60px 110px repeat(2, 60px) 30px;
  }

  .price-input {
    border: 1px solid #ddd;
    border-radius: 4px;
    max-width: 56px;
    padding: 2px 4px;
    margin-right: 8px;
  }
}
</style>
