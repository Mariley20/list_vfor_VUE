<template>
  <v-dialog
    v-model="showModal"
    width="600"
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
          Editar contenido
        </v-toolbar-title>
        <v-spacer />
        <v-btn
          icon
          @click="closeModal"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
      <v-card-text class="fill-height pt-4">
        <table>
          <tbody>
            <tr class="sheet-row">
              <th>Texto breve</th>
              <th>Precio neto</th>
              <th>Precio Historico</th>
              <th class="px-3">
                Variación
              </th>
            </tr>
            <template v-for="(row, rowIndex) in historicoItems">
              <tr
                v-if="rowIndex > 0"
                :key="rowIndex"
                class="sheet-row"
              >
                <template v-for="(item, x) in row">
                  <td :key="x">
                    <v-text-field
                      v-if="x === 2"
                      v-model.number="item.value"
                      height="28"
                      dense
                      hide-details="auto"
                      outlined
                      style="max-width: 100px;"
                    />
                    <span
                      v-else-if="x===3"
                      class="px-3"
                    >{{ getVariacion(row, rowIndex) }}</span>
                    <div
                      v-else-if="x===1"
                      class="text-no-wrap px-3"
                    >
                      <b>{{ item.value }}</b>
                    </div>
                    <div
                      v-else
                      class="px-3 text-no-wrap"
                    >
                      {{ item.value }} <br>
                      <small>({{ item.provider.value }})</small>
                    </div>
                  </td>
                </template>
              </tr>
            </template>
          </tbody>
        </table>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          height="32"
          color="primary"
          @click="saveInVuex"
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
// import getProductByProvider from '@/helpers/getProductByProvider'
import { NET_PRICE } from '@/constants/settings'
import { mapActions } from 'vuex'

export default {
  props: {
    value: { type: Boolean, default: false },
    sheetRowsProducts: { type: Array, default: () => [] }
  },
  data () {
    return {
      historicoItems: [[{ value: 'Texto breve' }, { value: 'Precio Neto' }, { value: 'Historico' }, { value: 'Variación' }]]
    }
  },
  computed: {
    showModal: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    },

    priceNetIndex () {
      const priceNetIndex = []

      this.sheetRowsProducts[0].forEach((item, i) => {
        if (item.value === NET_PRICE) {
          priceNetIndex.push(i)
        }
      })

      return priceNetIndex
    }
  },
  watch: {
    sheetRowsProducts: {
      immediate: true,
      deep: true,
      handler (newValue, oldValue) {
        this.getDataParaHistorico()
        // const products = getProductByProvider(this.sheetRowsProducts)
        // console.log(products)
      }
    }
  },
  created () {
  },
  methods: {
    ...mapActions({
      setHistoricalData: 'app/setHistoricalData'
    }),
    getDataParaHistorico () {
      const priceNetIndex = []

      this.sheetRowsProducts[0].forEach((item, i) => {
        if (item.value === NET_PRICE) {
          priceNetIndex.push(i)
        }
      })
      this.sheetRowsProducts.forEach((item, i) => {
        if (i > 0) {
          const historicoItemsAux = [item[0]]
          priceNetIndex.forEach(index => {
            if (item[index].isTheBestOption) {
              historicoItemsAux.push(item[index], { value: item[index].value }, { value: 0 })
            }
          })
          this.historicoItems.push(historicoItemsAux)
        }
      })
    },
    getVariacion (row, rowIndex) {
      const precioNeto = row[1].value
      const precioHistorico = row[2].value

      const variacion = (precioNeto - precioHistorico) / precioHistorico
      this.historicoItems[rowIndex][3].value = variacion

      return `${Math.round((variacion * 100) * 100) / 100}%`
    },
    saveInVuex () {
      this.setHistoricalData({ data: this.historicoItems })
    },
    closeModal () {
      this.setHistoricalData({ data: this.historicoItems })
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
}</style>
