<template>
  <tr class="sheet-row">
    <td>
      <div>
        <div>{{ licitacionDetail.product_name }}</div>
        <div>{{ licitacionDetail.company_name }}</div>
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

import { mapActions } from 'vuex'

export default {
  props: {
    value: { type: Boolean, default: false },
    licitacionDetail: { type: Object, default: null }
  },
  data () {
    return {
      historyPrice: 0
    }
  },
  computed: {
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
        last_price: this.historyPrice
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
