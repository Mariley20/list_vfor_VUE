<template>
  <tr class="sheet-row">
    <td>#{{ index }}</td>
    <td>
      <div>
        <div>{{ licitacionDetail.product_name }}</div>
        <small>{{ licitacionDetail.company_name }}</small>
        <div class="font-weight-medium">
          <small v-if="!!productCode">{{ productCode }}</small>
        </div>
      </div>
    </td>
    <td>{{ licitacionDetail.price }}</td>
    <td>
      <v-text-field
        v-model.number="historyPrice"
        height="28"
        dense
        hide-details="auto"
        outlined
        style="max-width: 100px;"
        @change="handleUpdateProductPriceHistory"
      />
    </td>
    <td>{{ historyVariacionText }}</td>
  </tr>
</template>

<script>

import { mapState, mapActions } from 'vuex'

export default {
  props: {
    value: { type: Boolean, default: false },
    index: { type: Number, default: 0 },
    licitacionDetail: { type: Object, default: null }
  },
  data () {
    return {
      historyPrice: 0
    }
  },
  computed: {
    ...mapState({
      products: (state) => state.licitacion.products
    }),
    showModal: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    },
    historyVariacion () {
      const variacion = (this.licitacionDetail.price_landed - this.historyPrice) / this.historyPrice
      return Math.round(variacion * 100) / 100
    },
    historyVariacionText () {
      return `${this.historyVariacion * 100}%`
    },
    productCode () {
      const product = this.products.find(item => item.id === this.licitacionDetail.producto_id)
      return product.code
    }
  },
  mounted () {
    this.historyPrice = this.licitacionDetail.price_landed
  },
  methods: {
    ...mapActions({
      updatePartialProductData: 'licitacion/updatePartialProductData'
    }),
    handleUpdateProductPriceHistory () {
      const data = {
        last_price: this.historyPrice,
        variacion: this.historyVariacionText
      }
      const productId = this.licitacionDetail.producto_id
      this.updatePartialProductData({ productId, data })
    }
  }
}
</script>

<style lang="scss" scoped>
.sheet-table,
table {
  border: 1px solid black;
  border-collapse: collapse;
}

.sheet-row td,
th {
  border: 1px solid rgb(228, 228, 228);
  padding: 2px 8px;
}
</style>
