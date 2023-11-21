<template>
  <v-container fluid>
    <div class="d-flex flex-wrap mb-4 align-center">
      <div>
        <div class="primary--text subtitle-2">
          Subir excel de licitacion
        </div>
        <input
          id="input"
          type="file"
          @change="uploadExcelFile($event)"
        >
      </div>
      <div v-if="products.length> 0">
        <div class="primary--text subtitle-2">
          Subir codigos de producto
        </div>
        <input
          id="input"
          ref="INPUT_PRODUCT_CODES"
          type="file"
          @change="uploadProductCodesFile($event)"
        >
      </div>
      <v-btn
        v-if="products.length>0"
        color="success"
        class="mx-4 text-none"
        @click="handleCreateCotizacion"
      >
        Agregar nueva cotización
      </v-btn>
      <v-btn
        v-if="licitacionDetails.length>0"
        color="primary"
        class="text-none"
        @click="showCompativeModal =!showCompativeModal"
      >
        Ver historico
      </v-btn>
      <v-btn
        v-if="licitacionDetails.length>0"
        color="info"
        class="text-none mx-3"
        @click="resetLicitacionDetails"
      >
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
      <v-btn
        v-if="licitacionDetails.length>0"
        color="error"
        class="text-none"
        @click="printDownload"
      >
        <v-icon>mdi-printer</v-icon>
      </v-btn>
      <!-- <v-btn
        v-if="licitacionDetails.length>0"
        color="error"
        class="text-none"
        :to="{name:'printer'}"
      >
        <v-icon>mdi-printer</v-icon>
      </v-btn> -->
    </div>
    <v-divider class="mb-4" />
    <div class="overflow-auto">
      <AppLicitacionSeccion />
      <AppCompaniesSection />
    </div>
    <HistoricoModal
      v-model="showCompativeModal"
    />
    <NewCotizacionModal
      v-if="products.length>0"
      :key="keyNewCotizacionModal"
      v-model="showNewCotizacionModal"
    />
    <AppPrintLicitacionFull
      ref="DownloadLicitacionFull"
      style="display: none;"
    />
  </v-container>
</template>

<script>
import getLicitacionDataFromExcelTosave from '@/helpers/getLicitacionDataFromExcelTosave'
import getCompaniesFromExcelTosave from '@/helpers/getCompaniesFromExcelTosave'
import getProductsDataFromExcelTosave from '@/helpers/getProductsDataFromExcelTosave'
import getLicitacionDetailsFromExcelTosave from '@/helpers/getLicitacionDetailsFromExcelTosave'
import getLicitacionDetailsCompared from '@/helpers/getLicitacionDetailsCompared'
import getProductCodesFromExcelTosave from '@/helpers/getProductCodesFromExcelTosave'

import { read, utils } from 'xlsx-js-style'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'AboutView',
  components: {
    AppLicitacionSeccion: () => import('@/components/AppLicitacionSeccion.vue'),
    AppCompaniesSection: () => import('@/components/AppCompaniesSection.vue'),
    HistoricoModal: () => import('@/components/HistoricoModal.vue'),
    AppPrintLicitacionFull: () => import('@/components/AppPrintLicitacionFull.vue'),
    NewCotizacionModal: () => import('@/components/NewCotizacionModal.vue')
  },
  data () {
    return {
      firstWorksheet: null,
      showCompativeModal: false,
      showNewCotizacionModal: false,
      keyNewCotizacionModal: 0
    }
  },
  computed: {
    ...mapState({
      licitacionDetails: (state) => state.licitacion.licitacionDetails,
      products: (state) => state.licitacion.products
    })
  },
  methods: {
    ...mapActions({
      setLicitacionData: 'licitacion/setLicitacionData',
      setLicitacionDetails: 'licitacion/setLicitacionDetails',
      setProducts: 'licitacion/setProducts',
      setCompanies: 'licitacion/setCompanies',
      resetLicitacionDetails: 'licitacion/resetLicitacionDetails'
    }),
    uploadExcelFile (event) {
      const selectedXlsxFile = event.target.files[0]
      if (this.products.length > 0) {
        this.$refs.INPUT_PRODUCT_CODES.value = ''
      }
      const fileReader = new FileReader()

      fileReader.onload = () => {
        const arrayBuffer = fileReader.result

        const workbook = read(arrayBuffer)
        const firstWorksheet = workbook.Sheets[workbook.SheetNames[0]]
        const firstWorksheetData = utils.sheet_to_json(firstWorksheet, { header: 1, nullError: true })

        this.saveFullData(firstWorksheetData)
      }
      fileReader.readAsArrayBuffer(selectedXlsxFile)
    },
    uploadProductCodesFile (event) {
      const selectedXlsxFile = event.target.files[0]

      const fileReader = new FileReader()

      fileReader.onload = () => {
        const arrayBuffer = fileReader.result

        const workbook = read(arrayBuffer)
        const firstWorksheet = workbook.Sheets[workbook.SheetNames[1]]
        const firstWorksheetData = utils.sheet_to_json(firstWorksheet, {
          header: 12
        })
        const products = getProductCodesFromExcelTosave(firstWorksheetData, this.products, this.licitacionDetails)
        this.setProducts({ products: products })
      }
      fileReader.readAsArrayBuffer(selectedXlsxFile)
    },
    async saveFullData (firstWorksheetData) {
      const licitacionDataToSave = getLicitacionDataFromExcelTosave(firstWorksheetData)
      const companiesDataToSave = getCompaniesFromExcelTosave(firstWorksheetData)
      const productsDataToSave = getProductsDataFromExcelTosave(firstWorksheetData)
      const licitacionDetails = getLicitacionDetailsFromExcelTosave(firstWorksheetData)
      licitacionDetails.forEach(async (detail, index) => {
        const company = companiesDataToSave.find(company => company.name === detail.company_name)
        const product = productsDataToSave
          .find(product => product.name === detail.product_name && product.position === detail.product_position)

        licitacionDetails[index].licitacion_id = licitacionDataToSave.id
        licitacionDetails[index].company_id = company.id
        licitacionDetails[index].producto_id = product.id
        licitacionDetails[index].company_numero_de_oferta = company.numero_de_oferta
      })

      this.setLicitacionData({ data: licitacionDataToSave })
      this.setLicitacionDetails({ licitacionDetails: getLicitacionDetailsCompared(licitacionDetails, productsDataToSave) })
      this.setCompanies({ data: companiesDataToSave })
      this.setProducts({ products: productsDataToSave })
    },
    handleCreateCotizacion () {
      this.showNewCotizacionModal = true
      this.keyNewCotizacionModal += 1
    },
    printDownload () {
      const w = window.open()
      w.document.write(this.$refs.DownloadLicitacionFull.$el.innerHTML)
      w.document.close()
      w.setTimeout(function () {
        w.print()
      }, 1000)
    }
  }
}

</script>
<style lang="scss" scoped>
.sheet-table {
  border: 1px solid black;
  border-collapse: collapse;
}
</style>
