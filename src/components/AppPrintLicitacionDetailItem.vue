<template>
  <div
    class="licitacion-detail-item"
    :class="{ 'licitacion-detail-item__hide-products': !showProductName }"
  >
    <template v-if="showProductName">
      <div
        class="font-weight-bold"
        style="line-height: normal;"
        :class="{ 'error--text': productUnlisted }"
      >
        <small>#{{ licitacionDetailIndex + 1 }}</small>
      </div>
      <div
        class="font-weight-bold"
        style="line-height: normal;"
        :class="{ 'error--text': productUnlisted }"
      >
        <small>{{ productCode }}</small>
      </div>
      <div
        class="font-weight-bold overflow-hidden"
        style="line-height: normal;"
        :class="{ 'error--text': productUnlisted }"
      >
        <small>{{ licitacionDetail.product_name }}</small>
      </div>
    </template>
    <div
      :class="{
        'text-decoration-line-through error--text': licitacionDetail.disabled,
        'warning': licitacionDetail.better_dias_de_entrega
      }"
    >
      {{ licitacionDetail.dias_de_entrega }}
    </div>
    <div
      style="position: relative;"
      :class="{ 'text-decoration-line-through error--text': licitacionDetail.disabled }"
    >
      {{ licitacionDetailValorNeto }}
    </div>
    <div :class="{ 'text-decoration-line-through error--text': licitacionDetail.disabled }">
      <div class="text-center">
        {{ licitacionDetail.price }}
      </div>
    </div>
    <div
      :class="{
        'text-decoration-line-through error--text': licitacionDetail.disabled,
        'success': licitacionDetail.better_price_landed
      }"
    >
      {{ licitacionDetail.price_landed }}
    </div>
    <div :class="{ 'text-decoration-line-through error--text': licitacionDetail.disabled }">
      {{ licitacionDetail.cantidad }}
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

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
      licitacionDetailManually: false,
      licitacionDetailDisabled: false,
      showPriceNetoInput: false
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
    productCode () {
      const product = this.products.find(item => item.id === this.licitacionDetail.producto_id)
      return product.code
    },
    showProductName () {
      return this.companyIndex === 0
    },
    productUnlisted () {
      if (this.showProductName) {
        const productLicitacionDetails = this.licitacionDetails.filter(detail => detail.producto_id === this.licitacionDetail.producto_id)
        return productLicitacionDetails.every(detail => detail.better_price_landed === false)
      }
      return true
    },
    companyFactorLanded () {
      return this.company.factor_landed
    },
    licitacionDetailValorNeto () {
      return Math.round((this.licitacionDetail.price * this.licitacionDetail.cantidad) * 100) / 100
    }
  },
  watch: {
    licitacionDetail: {
      immediate: false,
      deep: true,
      handler (newValue) {
        this.licitacionDetailManually = this.licitacionDetail.manually_selected
        this.licitacionDetailDisabled = this.licitacionDetail.disabled
      }
    }
  },
  mounted () {
    this.companyPriceNeto = this.licitacionDetail.price
    this.licitacionDetailManually = this.licitacionDetail.manually_selected
  },
  methods: {
    ...mapActions({
      updatePartialLicitacionDetailData: 'licitacion/updatePartialLicitacionDetailData',
      disableLicitacionDetail: 'licitacion/disableLicitacionDetail',
      manuallySelectLicitacionDetail: 'licitacion/manuallySelectLicitacionDetail',
      resetLicitacionDetailsAvailables: 'licitacion/resetLicitacionDetailsAvailables'
    }),
    handleManuallySelectCheckClick (event) {
      const licitacionDetailId = this.licitacionDetail.id
      const productId = this.licitacionDetail.producto_id
      const manually = event.target.checked
      this.manuallySelectLicitacionDetail({ licitacionDetailId, productId, manually })
    },
    handleDisabledCheckClick (event) {
      const licitacionDetailId = this.licitacionDetail.id
      const productId = this.licitacionDetail.producto_id
      const disabled = event.target.checked
      this.disableLicitacionDetail({ licitacionDetailId, productId, disabled })
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
      this.showPriceNetoInput = false
      this.resetLicitacionDetailsAvailables()
    }
  }
}
</script>

<style lang="scss" scoped>
.licitacion-detail-item {
  display: grid;
  text-align: center;
  grid-template-columns: 28px 61px 130px 60px 60px 110px repeat(2, 60px);
  grid-template-rows: 37px;
  // border: 1px solid rgb(228, 228, 228);

  &>div {
    padding: 4px;
    align-self: stretch;
    border-left: 1px solid #ddd;
    border-top: 1px solid #ddd;
  }

  &__hide-products {
    grid-template-columns: 60px 60px 110px repeat(2, 60px);
  }

  .price-input {
    border: 1px solid #ddd;
    border-radius: 4px;
    max-width: 65px;
    padding: 2px 4px;
    margin-right: 4px;
  }

  .tag {
    height: 5px;
    width: 8px;
    background-color: #92d050;
    position: absolute;
    bottom: 0;
    right: 0;
  }
}
</style>
