<template>
  <v-dialog
    v-model="showModal"
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
          Cuadro historico
        </v-toolbar-title>
        <v-spacer />
        <v-btn
          icon
          @click="printDownload"
        >
          <v-icon>mdi-printer</v-icon>
        </v-btn>
        <v-btn
          icon
          @click="showModal = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
      <v-card-text class="fill-height pt-4">
        <div class="d-flex align-center">
          <div class="mb-3">
            <div class="primary--text subtitle-2">
              Subir excel de licitacion
            </div>
            <input
              id="input"
              type="file"
              @change="uploadExcelFile($event)"
            >
            <v-progress-circular
              v-if="loadingExcel"
              indeterminate
              color="primary"
            />
          </div>
          <v-btn
            v-if="historicoFile.length>0"
            color="info"
            class="text-none mx-3"
            @click="calculateHistoricos"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </div>
        <table class="mx-auto mt-3 text-caption">
          <tbody>
            <tr class="sheet-row">
              <th>#</th>
              <th>Material</th>
              <th>Texto breve</th>
              <th>Fabricante 1</th>
              <th>N_parte1</th>
              <th>Cantidad solicitado</th>
              <th>Unidad de medida</th>
              <th>Ultimo prov SAP</th>
              <th>Ultimo precio SAP</th>
              <th>Ultimo moneda SAP</th>
              <th>Fecha ultimo pedido</th>
              <th>Precio Actual</th>
              <th class="px-1">
                Variación (%)
              </th>
              <th class="px-1">
                Variación (MONEDA)
              </th>
              <th class="px-1">
                Proveedor
              </th>
            </tr>
            <HistoricoItem
              v-for="(detail, rowIndex) in historico"
              :key="detail.id"
              :index="rowIndex+1"
              :licitacion-detail="detail"
              class="sheet-row"
            />
          </tbody>
        </table>
        <AppPrintHistoricoSection
          ref="DownloadCompHistorico"
          style="display: none;"
        />
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
import { read, utils } from 'xlsx-js-style'
import { mapState, mapActions } from 'vuex'
import HistoricoItem from '@/components/HistoricoItem.vue'
import AppPrintHistoricoSection from '@/components/AppPrintHistoricoSection.vue'
import getHistoricoFromExcelTosave from '@/helpers/getHistoricoFromExcelTosave.js'
export default {
  components: {
    HistoricoItem, AppPrintHistoricoSection
  },
  props: {
    value: { type: Boolean, default: false }
  },
  data () {
    return {
      loadingExcel: false,
      historicoFile: []
    }
  },
  computed: {
    ...mapState({
      licitacionDetails: (state) => state.licitacion.licitacionDetails,
      products: (state) => state.licitacion.products,
      historico: (state) => state.licitacion.historico
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
  showModal: {
    data (newValue, oldValue) {
      if (newValue) {
        this.calculateHistoricos()
      }
    }
  },
  methods: {
    ...mapActions({
      setHistoricoData: 'licitacion/setHistoricoData'
    }),
    saveHistoricoData () {
      this.showModal = false
    },
    printDownload () {
      const w = window.open()
      w.document.write(this.$refs.DownloadCompHistorico.$el.innerHTML)
      w.document.close()
      w.setTimeout(function () {
        w.print()
      }, 1000)
    },
    uploadExcelFile (event) {
      const selectedXlsxFile = event.target.files[0]
      this.loadingExcel = true
      const fileReader = new FileReader()

      fileReader.onload = () => {
        const arrayBuffer = fileReader.result

        const workbook = read(arrayBuffer)
        const firstWorksheet = workbook.Sheets[workbook.SheetNames[0]]
        const firstWorksheetData = utils.sheet_to_json(firstWorksheet, { header: 8 })
        this.historicoFile = firstWorksheetData
        this.calculateHistoricos()

        this.loadingExcel = false
      }
      fileReader.readAsArrayBuffer(selectedXlsxFile)
    },
    calculateHistoricos () {
      const historico = getHistoricoFromExcelTosave(this.historicoFile,
        this.products, this.betterLicitacionDetails)

      historico.sort((a, b) => {
        if (a.productName < b.productName) {
          return -1
        }
        if (a.productName > b.productName) {
          return 1
        }
        return 0
      })
      this.setHistoricoData({ data: historico })
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
