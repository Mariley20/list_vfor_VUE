<template>
  <div class="caption">
    <div v-if="companies.length > 0">
      <table class="sheet-table">
        <tbody>
          <tr>
            <td class="font-weight-bold">
              Proveedor
            </td>
            <td
              v-for="(company, companyIndex) in companies"
              :key="companyIndex"
            >
              {{ company.name }}
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold">
              Moneda de la oferta
            </td>
            <td
              v-for="(company, companyIndex) in companies"
              :key="companyIndex"
            >
              {{ company.moneda_de_la_oferta }}
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold">
              Cond de pago
            </td>
            <td
              v-for="(company, companyIndex) in companies"
              :key="companyIndex"
            >
              {{ company.cond_de_pago }}
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold">
              Costo de Embalaje
            </td>
            <td
              v-for="(company, companyIndex) in companies"
              :key="companyIndex"
            >
              {{ company.costo_de_embalaje }}
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold">
              Costo de flete
            </td>
            <td
              v-for="(company, companyIndex) in companies"
              :key="companyIndex"
            >
              {{ company.costo_de_flete }}
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold">
              Vig de Cotizacion
            </td>
            <td
              v-for="(company, companyIndex) in companies"
              :key="companyIndex"
            >
              {{ company.vig_de_cotizacion }}
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold">
              Descripcion
            </td>
            <td
              v-for="(company, companyIndex) in companies"
              :key="companyIndex"
            >
              {{ company.descripcion }}
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold">
              Numero de Oferta
            </td>
            <td
              v-for="(company, companyIndex) in companies"
              :key="companyIndex"
            >
              {{ company.numero_de_oferta }}
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold">
              Valor total final
            </td>
            <td
              v-for="(company, companyIndex) in companies"
              :key="companyIndex"
            >
              {{ company.valor_total_final }}
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold">
              Valor neto anterior
            </td>
            <td
              v-for="(company, companyIndex) in companies"
              :key="companyIndex"
            >
              {{ company.valor_neto_anterior }}
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold">
              Ponderacion Tecnica
            </td>
            <td
              v-for="(company, companyIndex) in companies"
              :key="companyIndex"
            >
              {{ company.ponderacion_tecnica }}
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold">
              Tipo de Cambio
            </td>
            <td
              v-for="(company, companyIndex) in companies"
              :key="companyIndex"
            >
              {{ company.tipo_de_cambio }}
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold">
              INCOTERM
            </td>
            <td
              v-for="(company, companyIndex) in companies"
              :key="companyIndex"
            >
              {{ company.incoterm }}
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold">
              Factor Landed
            </td>
            <td
              v-for="(company, companyIndex) in companies"
              :key="companyIndex"
              class="pa-1"
            >
              <!-- {{ company.factor_landed }} -->
              <AppCompanyFactorLanded
                :company="company"
              />
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold">
              Comentario
            </td>
            <td
              v-for="(company, companyIndex) in companies"
              :key="companyIndex"
              class="pa-1"
            >
              <!-- {{ company.comment }} -->
              <AppCompanyComment
                :company="company"
              />
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold">
              Valor Total de la Oferta
            </td>
            <td
              v-for="(company, companyIndex) in companies"
              :key="companyIndex"
            >
              {{ company.valor_total_final }}
            </td>
          </tr>
          <tr>
            <td
              v-for="(company, companyIndex) in companies"
              :key="companyIndex"
              :colspan="companyIndex === 0 ? 2 : 1"
            >
              <AppLicitacionDetailSection
                :company="company"
                :company-index="companyIndex"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  components: {
    AppLicitacionDetailSection: () => import('@/components/AppLicitacionDetailSection.vue'),
    AppCompanyComment: () => import('@/components/AppCompanyComment.vue'),
    AppCompanyFactorLanded: () => import('@/components/AppCompanyFactorLanded.vue')
  },
  data () {
    return {
      addComment: false
    }
  },
  computed: {
    ...mapState({
      companies: (state) => state.licitacion.companies,
      products: (state) => state.licitacion.products
    })
  }
}
</script>

<style lang="scss" scoped>
.licitacion-grid {
  display: grid;
  grid-template-columns: minmax(150px, 210px) auto;
  align-items: center;
  max-width: 400px;
  border-bottom: thin solid #ddd;
}

.sheet-table {
  border: 1px solid black;
  border-collapse: collapse;

  td {
    border: 1px solid rgb(228, 228, 228);
    vertical-align: top;

    &:first-child {
      padding-left: 8px;
    }
    &:last-child {
      padding-right: 8px;
    }
  }

}
</style>
