<template>
  <table class="sheet-table-detail">
    <tbody>
      <tr>
        <template v-if="companyIndex === 0">
          <th>
            <b>#</b>
          </th>
          <th
            style="padding: 2px;"
          >
            <b>Material</b>
          </th>
          <th
            style="padding: 2px; min-width: 150px;"
          >
            <b>Texto breve</b>
          </th>
        </template>
        <template v-else>
          <th>
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
          <th>✅</th>
          <th>❌</th>
        </template>
      </tr>
      <AppLicitacionDetailItem
        v-for="(licitacionDetail, index) in companyLicitacionDetails"
        :key="index"
        :company="company"
        :company-index="companyIndex"
        :licitacion-detail="licitacionDetail"
        :licitacion-detail-index="index"
      />
    </tbody>
  </table>
  <!-- <div>
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
      <div>✅</div>
      <div>❌</div>
    </div>

    <AppLicitacionDetailItem
      v-for="(licitacionDetail, index) in companyLicitacionDetails"
      :key="index"
      :company="company"
      :company-index="companyIndex"
      :licitacion-detail="licitacionDetail"
      :licitacion-detail-index="index"
    />
  </div> -->
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

<style lang="scss"  >
.sheet-table-detail {
  border-collapse: collapse;

  td{
    vertical-align: middle;
    border-right: 1px solid rgb(228, 228, 228);
    border-top: 1px solid rgb(228, 228, 228);
    line-height: 1;
    padding: 0 4px;
    height: 40px;
    text-align: center;
  }
  th {
    border-right: 1px solid rgb(228, 228, 228);
    line-height: 1;
    padding: 0 4px;
    height: 35px;
  }
}
</style>
