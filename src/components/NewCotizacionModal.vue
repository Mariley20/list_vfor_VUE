<template>
  <v-dialog
    v-model="showModal"
    width="800"
    persistent
  >
    <v-card>
      <v-app-bar
        color="primary"
        dark
        flat
        tile
        :height="40"
      >
        <v-toolbar-title>
          Nueva cotización
        </v-toolbar-title>
        <v-spacer />
        <v-btn
          icon
          @click="showModal = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
      <v-card-text class="fill-height pt-4">
        <v-form
          :id="FORM_COTIZACION"
          :ref="FORM_COTIZACION"
          v-model="validForm"
          lazy-validation
          @submit.prevent="saveCotizacion"
        >
          <div
            class="d-flex flex-wrap"
            style="gap:0 16px"
          >
            <v-text-field
              v-model="companyData.name"
              outlined
              label="Proveedor"
              dense
              :rules="rules.name"
              style="width: 250px;"
            />
            <v-text-field
              v-model.number="companyFactorLanded"
              outlined
              label="Factor Landed"
              style="width: 250px;"
              dense
            />
            <v-text-field
              v-model="companyData.cond_de_pago"
              outlined
              label="Cond de pago"
              style="width: 250px;"
              dense
            />
            <v-text-field
              v-model="companyData.vig_de_cotizacion"
              outlined
              label="Vig de cotización"
              style="width: 250px;"
              dense
            />
            <v-text-field
              v-model="companyData.incoterm"
              outlined
              label="INCOTERM"
              style="width: 250px;"
              dense
            />
          </div>
        </v-form>

        <table>
          <tbody>
            <tr class="sheet-row">
              <th>Texto breve</th>
              <th>Dias de entrega</th>
              <th>Valor neto</th>
              <th>Precio neto</th>
              <th>Precio Landed</th>
              <th>Cantidad</th>
            </tr>
            <tr
              v-for="(item, index) in newLicitacionDetails"
              :key="index"
              class="sheet-row"
            >
              <td>
                {{ item.product_name }}
              </td>
              <td>
                <input
                  v-model="item.dias_de_entrega"
                  type="number"
                  class="product-input"
                >
              </td>
              <td>
                {{ getNumberFormatted( item.price * item.cantidad) }}
              </td>
              <td>
                <input
                  v-model.number="item.price"
                  type="number"
                  class="product-input"
                >
              </td>
              <td>
                {{ getPriceLanded(item, index ) }}
              </td>
              <td>
                {{ item.cantidad }}
              </td>
            </tr>
          </tbody>
        </table>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          height="32"
          type="submit"
          :disabled="!validForm || processingForm"
          :form="FORM_COTIZACION"
          color="primary"
        >
          Guardar
          <v-icon left>
            mdi-content-save
          </v-icon>
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import getNumberFormatted from '@/helpers/getNumberFormatted'

import { mapState, mapActions } from 'vuex'
import { v4 as uuidv4 } from 'uuid'
const FORM_COTIZACION = 'FORM_COTIZACION'

export default {
  components: {},
  props: {
    value: { type: Boolean, default: false }
  },
  data () {
    return {
      FORM_COTIZACION,
      companyFactorLanded: 0,
      companyData: {
        id: uuidv4(),
        name: '',
        moneda_de_la_oferta: '',
        cond_de_pago: '',
        costo_de_embalaje: 0,
        costo_de_flete: 0,
        vig_de_cotizacion: '',
        descripcion: '',
        numero_de_oferta: '',
        valor_total_final: 0,
        valor_neto_anterior: 0,
        ponderacion_tecnica: 0,
        tipo_de_cambio: 1,
        incoterm: '',
        valor_total_de_la_oferta: 0,
        factor_landed: 0,
        comment: ''
      },
      newLicitacionDetails: [],
      rules: {
        name: [
          (v) => !!v || 'Campo requerido'
        ]
      },
      validForm: true,
      showPassword: false,
      processingForm: false,
      getNumberFormatted
    }
  },
  computed: {
    ...mapState({
      licitacion: (state) => state.licitacion.licitacion,
      licitacionDetails: (state) => state.licitacion.licitacionDetails,
      companies: (state) => state.licitacion.companies,
      products: (state) => state.licitacion.products
    }),
    showModal: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  },
  created () {
    const companyitem = this.companies[0]
    this.companyData.moneda_de_la_oferta = companyitem.moneda_de_la_oferta
    this.companyData.descripcion = companyitem.descripcion
    this.companyData.numero_de_oferta = 'Manual'
    this.products.forEach(product => {
      const data = {
        id: uuidv4(),
        licitacion_id: this.licitacion.id,
        producto_id: product.id,
        company_id: this.companyData.id,
        product_name: product.name,
        company_name: this.companyData.name,
        dias_de_entrega: 0,
        unidad: 0,
        price: 0,
        cantidad: product.cantidad,
        price_landed: 0,
        better_dias_de_entrega: false,
        better_price_landed: false
      }

      this.newLicitacionDetails.push(data)
    })
  },
  methods: {
    ...mapActions({
      addLicitacionDetail: 'licitacion/addLicitacionDetail',
      addCompany: 'licitacion/addCompany'
    }),
    saveCotizacion () {
      if (!this.$refs[FORM_COTIZACION].validate()) return
      this.companyData.factor_landed = this.companyFactorLanded / 100
      this.addCompany({ data: this.companyData })

      this.newLicitacionDetails.forEach(element => {
        const data = element
        data.company_name = this.companyData.name
        this.addLicitacionDetail({ licitacionDetail: data })
      })

      this.showModal = false
    },
    getPriceLanded (detail, index) {
      const priceLanded = Math.round((detail.price + (detail.price * (this.companyFactorLanded / 100))) * 100) / 100
      this.newLicitacionDetails[index].price_landed = priceLanded
      return getNumberFormatted(priceLanded)
    }
  }
}
</script>

<style lang="scss" scoped>
.sheet-table,
table {
  border: 1px solid rgb(228, 228, 228);
  border-collapse: collapse;
  width: 100%;
  font-size: 12px;
}

.sheet-row td,
th {
  border: 1px solid rgb(228, 228, 228);
  padding: 2px 8px;
}

.product-input {
  border: 1px solid #ddd;
  border-radius: 4px;
  max-width: 80px;
  padding: 2px 4px;
  margin-right: 4px;
}
</style>
