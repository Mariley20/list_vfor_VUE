<template>
  <div>
    <div
      class="licitacion-detail font-weight-bold"
      :class="{ 'licitacion-detail__hide-products': !showProductName }"
    >
      <div v-if="showProductName">
        Texto breve
      </div>
      <div>Dias de entrega</div>
      <div>Valor neto</div>
      <div>Precio neto</div>
      <div>Precio Landed</div>
      <div>Cantidad</div>
    </div>

    <div
      v-for="(detail, index) in companyLicitaciones"
      :key="index"
      class="licitacion-detail"
      :class="{ 'licitacion-detail__hide-products': !showProductName }"
    >
      <div
        v-if="showProductName"
        class="font-weight-bold"
        style="line-height: normal;"
      >
        {{ products[index].name }}
      </div>
      <div :class="getDeliveryDaysClass(detail)">
        {{ detail.dias_de_entrega }}
      </div>
      <div>{{ detail.price * detail.cantidad }}</div>
      <div>{{ detail.price }}</div>
      <div :class="getPriceLandedClass(detail)">
        {{ detail.price_landed }}
      </div>
      <div>{{ detail.cantidad }}</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

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
    ...mapGetters({
      licitacionDetailIdsBestPriceLanded: 'licitacion/licitacionDetailIdsBestPriceLanded',
      licitacionDetailIdsBestDeliveryDays: 'licitacion/licitacionDetailIdsBestDeliveryDays'
    }),
    showProductName () {
      return this.companyIndex === 0
    },
    companyLicitaciones () {
      return this.licitacionDetails.filter(detail => detail.company_id === this.company.id)
    }

  },
  methods: {
    getPriceLandedClass (licitacionDetail) {
      if (licitacionDetail.manual_selection) {
        return 'success'
      }
      if (this.licitacionDetailIdsBestPriceLanded.includes(licitacionDetail.uuid)) {
        return 'success'
      }
      return null
    },
    getDeliveryDaysClass (licitacionDetail) {
      if (licitacionDetail.manual_selection) {
        return 'warning'
      }
      if (this.licitacionDetailIdsBestDeliveryDays.includes(licitacionDetail.uuid)) {
        return 'warning'
      }
      return null
    }
  }
}
</script>

<style lang="scss" scoped>
.licitacion-detail {
  display: grid;
  text-align: center;
  grid-template-columns: 110px repeat(5, 65px);
  border: 1px solid rgb(228, 228, 228);

  &>div {
    padding: 4px;
    align-self: center;
  }

  &__hide-products {
    grid-template-columns: repeat(5, 65px);
  }
}
</style>
