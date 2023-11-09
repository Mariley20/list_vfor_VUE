<template>
  <v-dialog
    v-model="showModal"
    width="800"
    persistent
    scrollable
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
          Editar contenido
        </v-toolbar-title>
        <v-spacer />
        <v-btn
          icon
          @click="showModal = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
      <v-card-text class="fill-height pt-4 d-flex justify-center">
        <table>
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
            <HistoricoItem
              v-for="(detail, rowIndex) in betterLicitacionDetails"
              :key="detail.id"
              :index="rowIndex+1"
              :licitacion-detail="detail"
              class="sheet-row"
            />
          </tbody>
        </table>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          height="32"
          color="primary"
          @click="saveHistoricoData"
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

import { mapState, mapActions } from 'vuex'
import HistoricoItem from '@/components/HistoricoItem.vue'
export default {
  components: {
    HistoricoItem
  },
  props: {
    value: { type: Boolean, default: false }
  },
  computed: {
    ...mapState({
      licitacionDetails: (state) => state.licitacion.licitacionDetails,
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
    betterLicitacionDetails () {
      return this.licitacionDetails.filter(detail => detail.better_price_landed === true)
    }
  },
  methods: {
    ...mapActions({
      setHistoricoData: 'licitacion/setHistoricoData'
    }),
    saveHistoricoData () {
      const historicoData = []
      this.betterLicitacionDetails.forEach(element => {
        const productData = this.products.find(item => item.id === element.producto_id)
        const data = {
          ...productData,
          price: element.price,
          company_name: element.company_name
        }
        historicoData.push(data)
      })
      console.log(historicoData)
      this.setHistoricoData({ data: historicoData })
      this.showModal = false
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
