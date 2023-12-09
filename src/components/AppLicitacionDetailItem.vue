<template>
  <tr>
    <template v-if="companyIndex === 0">
      <td
        class="font-weight-bold"
        style="line-height: normal;"
        :class="{ 'error--text': productUnlisted }"
      >
        <b> <small>#{{ licitacionDetailIndex + 1 }}</small></b>
      </td>
      <td
        class="font-weight-bold"
        style="line-height: normal;"
        :class="{ 'error--text': productUnlisted }"
      >
        <small>{{ productCode }}</small>
      </td>
      <td
        class="font-weight-bold overflow-hidden"
        style="line-height: normal;"
        :class="{ 'error--text': productUnlisted }"
      >
        <small>{{ licitacionDetail.product_name }}</small>
      </td>
    </template>
    <template v-else>
      <td
        :class="{
          'text-decoration-line-through error--text': licitacionDetail.disabled,
        }"
        :style="{'background-color':cantidadItemBgColor}"
      >
        <!-- <div class="d-flex align-center justify-end"> -->
        {{ licitacionDetail.dias_de_entrega }}
        <!-- </div> -->
      </td>
      <td
        style="position: relative;"
        :class="{ 'text-decoration-line-through error--text': licitacionDetail.disabled,
                  'font-weight-bold': licitacionDetail.better_price_landed }"
      >
        {{ getNumberFormatted(licitacionDetailValorNeto) }}
      </td>
      <td :class="{ 'text-decoration-line-through error--text': licitacionDetail.disabled }">
        <div class="d-flex align-center justify-end">
          <template v-if="showPriceNetoInput">
            <input
              v-model.number="companyPriceNeto"
              type="number"
              class="price-input"
              style="max-width: 85px;"
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
              {{ getNumberFormatted(licitacionDetail.price) }}
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
      </td>
      <td
        :class="{
          'text-decoration-line-through error--text': licitacionDetail.disabled,
          'yellow': licitacionDetail.better_price_landed
        }"
      >
        {{ getNumberFormatted(licitacionDetail.price_landed) }}
      </td>
      <td :class="{ 'text-decoration-line-through error--text': licitacionDetail.disabled }">
        {{ licitacionDetail.cantidad }}
      </td>
      <td>
        <input
          v-model="licitacionDetailManually"
          type="checkbox"
          :disabled="licitacionDetail.disabled"
          @change="handleManuallySelectCheckClick($event)"
        >
      </td>
      <td>
        <input
          v-model="licitacionDetailDisabled"
          type="checkbox"
          class="error--text"
          @change="handleDisabledCheckClick($event)"
        >
      </td>
    </template>
  </tr>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import getNumberFormatted from '@/helpers/getNumberFormatted'

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
    },
    cantidadItemBgColor () {
      if (this.licitacionDetailManually) {
        return '#A9D08E'
      }
      if (this.licitacionDetail.better_dias_de_entrega) {
        return '#E2EFDA'
      }
      return null
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
    getNumberFormatted,
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
</style>
