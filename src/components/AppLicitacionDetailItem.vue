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
      <div class="d-flex align-center justify-end">
        <template v-if="showdiasDeEntrega">
          <input
            v-model.number="diasDeEntrega"
            type="number"
            :min="0"
            class="price-input"
            @change="handleDiasDeEntrega"
          >
          <v-btn
            icon
            width="24"
            height="24"
            color="success"
            @click="showdiasDeEntrega = false"
          >
            <v-icon small>
              mdi-content-save-check
            </v-icon>
          </v-btn>
        </template>
        <div
          v-else
          class="d-flex align-center flex-grow-1"
        >
          <div class="text-center flex-grow-1">
            {{ licitacionDetail.dias_de_entrega }}
          </div>
          <v-btn
            v-if="!licitacionDetail.disabled"
            icon
            width="24"
            height="24"
            color="primary"
            @click="showdiasDeEntrega = true"
          >
            <v-icon small>
              mdi-pencil
            </v-icon>
          </v-btn>
        </div>
      </div>
    </div>
    <div
      style="position: relative;"
      :class="{ 'text-decoration-line-through error--text': licitacionDetail.disabled }"
    >
      {{ licitacionDetailValorNeto }}
      <div
        v-if="licitacionDetail.better_price_landed"
        class="tag"
      />
    </div>
    <div :class="{ 'text-decoration-line-through error--text': licitacionDetail.disabled }">
      <div class="d-flex align-center justify-end">
        <template v-if="showPriceNetoInput">
          <input
            v-model.number="companyPriceNeto"
            type="number"
            class="price-input"
            @change="handlePriceNeto"
          >
          <v-btn
            icon
            width="24"
            height="24"
            color="success"
            @click="showPriceNetoInput = false"
          >
            <v-icon small>
              mdi-content-save-check
            </v-icon>
          </v-btn>
        </template>
        <div
          v-else
          class="d-flex align-center flex-grow-1"
        >
          <div class="text-center flex-grow-1">
            {{ licitacionDetail.price }}
          </div>
          <v-btn
            v-if="!licitacionDetail.disabled"
            icon
            width="24"
            height="24"
            color="primary"
            @click="showPriceNetoInput = true"
          >
            <v-icon small>
              mdi-pencil
            </v-icon>
          </v-btn>
        </div>
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
    <div>
      <input
        v-model="licitacionDetailManually"
        type="checkbox"
        :disabled="licitacionDetail.disabled"
        @change="handleManuallySelectCheckClick($event)"
      >
    </div>
    <div>
      <input
        v-model="licitacionDetailDisabled"
        type="checkbox"
        class="error--text"
        @change="handleDisabledCheckClick($event)"
      >
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

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
      diasDeEntrega: 0,
      showPriceNetoInput: false,
      showdiasDeEntrega: false
    }
  },
  computed: {
    ...mapState({
      licitacionDetails: (state) => state.licitacion.licitacionDetails,
      products: (state) => state.licitacion.products
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
    },
    handleDiasDeEntrega () {
      const data = {
        dias_de_entrega: this.diasDeEntrega
      }
      this.updatePartialLicitacionDetailData({
        licitacionDetailId: this.licitacionDetail.id,
        data
      })
      this.showdiasDeEntrega = false
      this.resetLicitacionDetailsAvailables()
    }
  }
}
</script>

<style lang="scss" scoped>
.licitacion-detail-item {
  display: grid;
  text-align: center;
  grid-template-columns: 28px 61px 130px 100px 60px 110px repeat(2, 60px) 30px 30px;
  grid-template-rows: 37px;
  // border: 1px solid rgb(228, 228, 228);

  &>div {
    padding: 4px;
    align-self: stretch;
    border-left: 1px solid #ddd;
    border-top: 1px solid #ddd;
  }

  &__hide-products {
    grid-template-columns: 100px 60px 110px repeat(2, 60px) 30px 30px;
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
