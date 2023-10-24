<template>
  <div>
    <div
      class="licitacion-detail font-weight-bold"
      :class="{ 'licitacion-detail__hide-products': !showProductName }"
    >
      <template v-if="showProductName">
        <div>
          <small>#</small>
        </div>
        <div>
          <small>MATERIAL</small>
        </div>
        <div>
          Texto breve
        </div>
      </template>
      <div>Dias de entrega</div>
      <div>Valor neto</div>
      <div>Precio neto</div>
      <div>Precio Landed</div>
      <div>Cantidad</div>
      <div>X</div>
    </div>

    <AppLicitacionDetailItem
      v-for="(licitacionDetail, index) in companyLicitacionDetails"
      :key="index"
      :company="company"
      :company-index="companyIndex"
      :licitacion-detail="licitacionDetail"
      :licitacion-detail-index="index"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AppLicitacionDetailItem from '@/components/AppLicitacionDetailItem.vue'
export default {
  components: {
    AppLicitacionDetailItem
  },
  props: {
    company: { type: Object, default: null },
    companyIndex: { type: Number, default: 0 }
  },
  computed: {
    ...mapState({
      licitacionDetails: (state) => state.licitacion.licitacionDetails
    }),
    showProductName () {
      return this.companyIndex === 0
    },
    companyLicitacionDetails () {
      return this.licitacionDetails.filter(detail => detail.company_id === this.company.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.licitacion-detail {
  display: grid;
  text-align: center;
  grid-template-columns: 28px 61px 130px 60px 60px 120px repeat(2, 60px) 30px;
  // border: 1px solid rgb(228, 228, 228);

  &>div {
    padding: 4px;
    align-self: stretch;
    border-left: 1px solid #ddd;
  }

  &__hide-products {
    grid-template-columns: 60px 60px 120px repeat(2, 60px) 30px;
  }
}
</style>
