<template>
  <div class="caption">
    <div v-if="companies.length > 0">
      <table class="sheet-table">
        <tbody>
          <tr>
            <td
              class="font-weight-bold"
              style="vertical-align: middle;"
            >
              Proveedor
            </td>
            <td
              v-for="(company, companyIndex) in companies"
              :key="companyIndex"
              :class="getCompanyLicitacionSelected(company) ? '' : 'yellow'"
              style="vertical-align: middle;"
            >
              {{ company.name }}
              <v-btn
                fab
                x-small
                height="24"
                width="24"
                color="error"
                class="mx-5"
                @click="handleDeleteCompany(company)"
              >
                <v-icon size="14">
                  mdi-delete
                </v-icon>
              </v-btn>
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
          <tr style="background-color: #92d050;">
            <td class="font-weight-bold">
              Valor total final
            </td>
            <td
              v-for="(company, companyIndex) in companies"
              :key="companyIndex"
            >
              {{ getValorTotalFinal(company) }}
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
            <td
              class="font-weight-bold"
              style="vertical-align: middle;"
            >
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
              Valor Total de la Oferta
            </td>
            <td
              v-for="(company, companyIndex) in companies"
              :key="companyIndex"
            >
              {{ getTotalOferta(company) }}
            </td>
          </tr>
          <tr>
            <td
              v-for="(company, companyIndex) in companies"
              :key="companyIndex"
              :colspan="companyIndex === 0 ? 2 : 1"
              class="px-0"
            >
              <AppLicitacionDetailSection
                :company="company"
                :company-index="companyIndex"
              />
            </td>
          </tr>
          <tr>
            <td
              class="font-weight-bold"
              style="vertical-align: middle;"
            >
              Comentario
            </td>
            <td
              v-for="(company, companyIndex) in companies"
              :key="companyIndex"
              class="pa-1"
            >
              <AppCompanyComment
                :company="company"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
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
      licitacionDetails: (state) => state.licitacion.licitacionDetails
    })
  },
  methods: {
    ...mapActions({
      deleteCompany: 'licitacion/deleteCompany',
      resetLicitacionDetails: 'licitacion/resetLicitacionDetails'
    }),
    getTotalOferta (company) {
      const companyLicitacionDetails = this.licitacionDetails.filter(detail => detail.company_id === company.id)

      const total = companyLicitacionDetails.reduce((accumulator, currentValue) => {
        return accumulator + (currentValue.price * currentValue.cantidad)
      }, 0)

      return Math.round((total) * 100) / 100
    },
    getValorTotalFinal (company) {
      const companyLicitacionDetails = this.licitacionDetails.filter(detail => detail.company_id === company.id)

      const total = companyLicitacionDetails.reduce((accumulator, currentValue) => {
        if (currentValue.better_price_landed) {
          return accumulator + (currentValue.price * currentValue.cantidad)
        }
        return accumulator + 0
      }, 0)

      return Math.round((total) * 100) / 100
    },
    getCompanyLicitacionSelected (company) {
      const productLicitacionDetails = this.licitacionDetails.filter(detail => detail.company_id === company.id)
      return productLicitacionDetails.every(detail => detail.better_price_landed === false)
    },
    handleDeleteCompany (company) {
      this.deleteCompany({ companyId: company.id })
      this.resetLicitacionDetails()
    }
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
