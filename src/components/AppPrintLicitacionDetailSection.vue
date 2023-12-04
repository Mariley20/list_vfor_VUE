<template>
  <table
    border="1"
    style="border-collapse: collapse; border-color: #909090;font-size: 12px; width: 100%;
    font-family: system-ui;"
  >
    <tbody>
      <tr>
        <template v-if="companyIndex === 0">
          <th
            style="width: 16px;max-width: 16px; text-align: center; height: 30px;"
          >
            <b>#</b>
          </th>
          <th
            style="padding: 2px;"
          >
            <b>Material</b>
          </th>
          <th
            style="padding: 2px;"
          >
            <b>Texto breve</b>
          </th>
        </template>
        <template v-else>
          <th style="height: 30px;">
            <b>Dias de entrega</b>
          </th>
          <th><b>Valor neto</b></th>
          <th><b>Precio neto</b></th>
          <th><b>Precio Landed</b></th>
          <th
            style="padding: 0 2px;"
          >
            <b>Cantidad</b>
          </th>
        </template>
      </tr>
      <tr
        v-for="(licitacionDetail, index) in companyLicitacionDetails"
        :key="index"
        :style="{
          'color': getColorProductUnlisted(licitacionDetail)
        }
        "
      >
        <template v-if="companyIndex === 0">
          <td
            style="height: 40px;max-height: 40px; text-align: center;"
          >
            <b><small>{{ index+1 }}</small></b>
          </td>
          <td
            style="height: 40px;max-height: 40px; text-align: center;"
          >
            <small>{{ getProductCode(licitacionDetail) }}</small>
          </td>
          <td
            style="height: 40px;max-height: 40px; max-width: 182px; width: 182px text-align: center;"
          >
            <small>{{ licitacionDetail.product_name }}</small>
          </td>
        </template>
        <template v-else>
          <td
            style="height: 40px;max-height: 40px; text-align: center;"
            :style="{
              'background-color': licitacionDetail.better_dias_de_entrega ? '#ffeb3b': ''
            }"
          >
            {{ licitacionDetail.dias_de_entrega }}
          </td>
          <td
            style="height: 40px;max-height: 40px; text-align: center;"
            :style="{
              'font-weight': licitacionDetail.better_price_landed? 'bold': 'normal'
            }"
          >
            {{ getNumberFormatted(Math.round((licitacionDetail.price * licitacionDetail.cantidad )* 100) / 100 ) }}
          </td>
          <td style="height: 40px;max-height: 40px; text-align: center;">
            {{ getNumberFormatted(licitacionDetail.price) }}
          </td>
          <td
            style="height: 40px;max-height: 40px; text-align: center;"
            :style="{
              'background-color': licitacionDetail.better_price_landed ? '#ffeb3b': ''
            }"
          >
            {{ getNumberFormatted(licitacionDetail.price_landed) }}
          </td>
          <td style="height: 40px;max-height: 40px; text-align: center;">
            {{ licitacionDetail.cantidad }}
          </td>
        </template>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { mapState } from 'vuex'
import getNumberFormatted from '@/helpers/getNumberFormatted'

export default {
  props: {
    company: { type: Object, default: null },
    companyIndex: { type: Number, default: 0 }
  },
  computed: {
    ...mapState({
      licitacionDetails: (state) => state.licitacion.licitacionDetails,
      products: (state) => state.licitacion.products
    }),
    showProductName () {
      return this.companyIndex === 0
    },
    companyLicitacionDetails () {
      return this.licitacionDetails.filter(detail => detail.company_id === this.company.id)
    }
  },
  methods: {
    getNumberFormatted,
    getProductCode (detail) {
      const product = this.products.find(item => item.id === detail.producto_id)
      return product.code
    },
    getColorProductUnlisted (detailx) {
      const productLicitacionDetails = this.licitacionDetails.filter(detail => detail.producto_id === detailx.producto_id)
      return productLicitacionDetails.every(detail => detail.better_price_landed === false) ? '#ff0000' : ''
    }
  }
}
</script>

<style lang="scss" scoped>
.licitacion-detail {
  display: grid;
  text-align: center;
  grid-template-columns: 28px 61px 130px 60px 60px 110px repeat(2, 60px);
  // border: 1px solid rgb(228, 228, 228);

  &>div {
    padding: 4px;
    align-self: stretch;
    border-left: 1px solid #ddd;
  }

  &__hide-products {
    grid-template-columns: 60px 60px 110px repeat(2, 60px);
  }
}
</style>
