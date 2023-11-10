<template>
  <section
    v-if="betterLicitacionDetails.length > 0"
    class="mt-16 pt-16"
  >
    <table
      border="1"
      style="margin: 16px auto; border-collapse: collapse; border-color: #909090;"
    >
      <tbody>
        <tr class="sheet-row">
          <th>#</th>
          <th>Texto breve</th>
          <th>Precio neto</th>
          <th>Precio Historico</th>
          <th class="px-3">
            Variación
          </th>
        </tr>
        <tr
          v-for="(item,index) in betterLicitacionDetails"
          :key="item.id"
        >
          <td>
            #{{ index +1 }}
          </td>
          <td>
            <div>
              <div>{{ item.productName }}</div>
              <small>{{ item.companyName }}</small>
              <div class="font-weight-medium">
                <small v-if="!!item.code ">{{ item.code }}</small>
              </div>
            </div>
          </td>
          <td>
            {{ item.price }}
          </td>
          <td>
            {{ item.lastPrice }}
          </td>
          <td>
            {{ item.variacion }}
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      licitacionDetails: (state) => state.licitacion.licitacionDetails,
      products: (state) => state.licitacion.products
    }),
    betterLicitacionDetails () {
      const licitacionDetails = this.licitacionDetails.filter(detail => detail.better_price_landed === true)
      return licitacionDetails.map(item => {
        const product = this.products.find(product => product.id === item.producto_id)
        const variacion = product.last_price > 0 ? (item.price - product.last_price) / product.last_price : 0

        return {
          id: item.id,
          productName: product.name,
          productId: product.id,
          code: product.code,
          lastPrice: product.last_price,
          companyName: item.company_name,
          price: item.price,
          priceLanded: item.price_landed,
          variacion: `${(Math.round(variacion * 100) / 100) * 100}%`
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.sheet-table, table {
  border: 1px solid black;
  border-collapse: collapse;
}
.sheet-row td, th {
  border: 1px solid rgb(228, 228, 228);
  padding: 2px 8px;
}
</style>
