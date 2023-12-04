<template>
  <tr class="sheet-row">
    <td>#{{ index }}</td>
    <td>
      {{ licitacionDetail.material }}
    </td>
    <td>
      {{ licitacionDetail.productName }}
    </td>
    <td>{{ licitacionDetail.fabricante }}</td>
    <td>{{ licitacionDetail.nParte1 }}</td>
    <td>{{ licitacionDetail.cantidad }}</td>
    <td>{{ licitacionDetail.unidadDeMedida }}</td>
    <td>{{ licitacionDetail.ultimoProvSap }}</td>
    <td>{{ getNumberFormatted(licitacionDetail.ultimoPrecioSap) }}</td>
    <td>{{ licitacionDetail.ultimoMonedaSap }}</td>
    <td>{{ getNumberDateFormatted(licitacionDetail.fechaUltimoPedido) }}</td>
    <td>{{ getNumberFormatted(licitacionDetail.priceCurrent) }}</td>
    <td
      :class="{
        'red--text': licitacionDetail.variacionPercentage > 0
      }"
    >
      {{ getPercentageNumberFormatted(licitacionDetail.variacionPercentage) }}
    </td>
    <td>{{ getNumberFormatted(licitacionDetail.variacionMoneda ) }}</td>
    <td>{{ licitacionDetail.companyNameCurrent }}</td>
  </tr>
</template>

<script>

import { mapState, mapActions } from 'vuex'
import getNumberFormatted from '@/helpers/getNumberFormatted'
import getPercentageNumberFormatted from '@/helpers/getPercentageNumberFormatted'
import getNumberDateFormatted from '@/helpers/getNumberDateFormatted'

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
      const variacion = (this.licitacionDetail.price - this.historyPrice) / this.historyPrice
      return this.historyPrice > 0 ? Math.round(variacion * 100) / 100 : 0
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
    this.historyPrice = this.licitacionDetail.price
  },
  methods: {
    getNumberFormatted,
    getPercentageNumberFormatted,
    getNumberDateFormatted,
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
