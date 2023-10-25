<template>
  <div
    class="licitacion-detail-item"
    :class="{ 'licitacion-detail-item__hide-products': !showProductName }"
  >
    <template
      v-if="showProductName"
    >
      <div
        class="font-weight-bold"
        style="line-height: normal;"
        :class="{'error--text': cotizadorNotFound}"
      >
        <small>#{{ licitacionDetailIndex+1 }}</small>
      </div>
      <div
        class="font-weight-bold"
        style="line-height: normal;"
        :class="{'error--text': cotizadorNotFound}"
      >
        <small>{{ productCode }}</small>
      </div>
      <div
        class="font-weight-bold overflow-hidden"
        style="line-height: normal;"
        :class="{'error--text': cotizadorNotFound}"
      >
        <small>{{ licitacionDetail.product_name }}</small>
      </div>
    </template>
    <div :class="deliveryDaysClass">
      {{ licitacionDetail.dias_de_entrega }}
    </div>
    <div>{{ licitacionDetailValorNeto }}</div>
    <div>
      <div class="d-flex align-center">
        <input
          v-model.number="companyPriceNeto"
          type="number"
          class="price-input"
          @change="handlePriceNeto"
        >
        <span class="grey--text">{{ licitacionDetail.price }}</span>
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
    productCode () {
      const product = this.products.find(item => item.id === this.licitacionDetail.producto_id)
      return product.code
    },
    showProductName () {
      return this.companyIndex === 0
    },
    cotizadorNotFound () {
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
  grid-template-columns: 28px 61px 130px 60px 60px 120px repeat(2, 60px) 30px;
  grid-template-rows: 37px;
  // border: 1px solid rgb(228, 228, 228);

  &>div {
    padding: 4px;
    align-self: stretch;
    border-left: 1px solid #ddd;
    border-top: 1px solid #ddd;
  }

  &__hide-products {
    grid-template-columns: 60px 60px 120px repeat(2, 60px) 30px;
  }

  .price-input {
    border: 1px solid #ddd;
    border-radius: 4px;
    max-width: 65px;
    padding: 2px 4px;
    margin-right: 8px;
  }
}
</style>
