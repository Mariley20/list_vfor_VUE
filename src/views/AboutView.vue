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
          type="file"
          @change="uploadProductCodesFile($event)"
        >
      </div>
      <v-btn
        v-if="!!firstWorksheet"
        color="pink"
        @click="handleDownloadExcel"
      >
        export pdf
      </v-btn>
      <!-- <v-btn
        v-if="licitacionDetails.length>0"
        color="success"
        class="mx-4"
        @click="handleDownloadExcel"
      >
        Agregar nueva cotización
      </v-btn> -->
      <v-btn
        v-if="licitacionDetails.length>0"
        color="primary"
        @click="showCompativeModal =!showCompativeModal"
      >
        Ver historico
      </v-btn>
    </div>
    <v-divider class="mb-4" />
    <div class="overflow-auto">
      <AppLicitacionSeccion />
      <AppCompaniesSection />
    </div>
    <HistoricoModal
      v-model="showCompativeModal"
    />
  <!--   <CellModalEdit
      v-if="!!cellDataToEdit"
      v-model="showCellModalEdit"
      :item="cellDataToEdit"
      @click:edit-cell="handleSaveEditFactorLanded"
    /> -->
  </v-container>
</template>

<script>
import getLicitacionDataFromExcelTosave from '@/helpers/getLicitacionDataFromExcelTosave'
import getCompaniesFromExcelTosave from '@/helpers/getCompaniesFromExcelTosave'
import getProductsDataFromExcelTosave from '@/helpers/getProductsDataFromExcelTosave'
import getLicitacionDetailsFromExcelTosave from '@/helpers/getLicitacionDetailsFromExcelTosave'
import getLicitacionDetailsCompared from '@/helpers/getLicitacionDetailsCompared'
import getProductCodesFromExcelTosave from '@/helpers/getProductCodesFromExcelTosave'
import { SouthernApp as SouthernAppAPI } from '@/api/app.js'

import { read, utils } from 'xlsx-js-style'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'AboutView',
  components: {
    AppLicitacionSeccion: () => import('@/components/AppLicitacionSeccion.vue'),
    AppCompaniesSection: () => import('@/components/AppCompaniesSection.vue'),
    HistoricoModal: () => import('@/components/HistoricoModal.vue')
  },
  data () {
    return {
      excelData: [],
      excelFile: null,
      sheetRows: [],
      sheetRowsTender: [],
      sheetRowsProviders: [],
      sheetRowsProducts: [],
      firstWorksheet: null,
      firstWorksheetRows: [],
      firstWorksheetRef: null,
      showCellModalEdit: false,
      showCompativeModal: false,
      cellDataToEdit: null
    }
  },
  computed: {
    ...mapState({
      licitacionDetails: (state) => state.licitacion.licitacionDetails,
      products: (state) => state.licitacion.products
    })
  },
  created () {
    this.deleteFullData()
  },
  methods: {
    ...mapActions({
      setLicitacionData: 'licitacion/setLicitacionData',
      setLicitacionDetails: 'licitacion/setLicitacionDetails',
      setProducts: 'licitacion/setProducts',
      setCompanies: 'licitacion/setCompanies'
    }),
    uploadExcelFile (event) {
      const selectedXlsxFile = event.target.files[0]

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
          // nullError: true
          // blankrows: false,
          // raw: false
        })
        const products = getProductCodesFromExcelTosave(firstWorksheetData, this.products)
        this.setProducts({ products: products })
      }
      fileReader.readAsArrayBuffer(selectedXlsxFile)
    },
    async saveFullData (firstWorksheetData) {
      const licitacionDataToSave = getLicitacionDataFromExcelTosave(firstWorksheetData)
      const companiesDataToSave = getCompaniesFromExcelTosave(firstWorksheetData)
      const productsDataToSave = getProductsDataFromExcelTosave(firstWorksheetData)
      const licitacionDetails = getLicitacionDetailsFromExcelTosave(firstWorksheetData)

      console.log(firstWorksheetData)
      try {
        productsDataToSave.forEach(async (product, index) => {
          const productId = await SouthernAppAPI.createProduct({ data: product })

          productsDataToSave[index].id = productId
        })
        companiesDataToSave.forEach(async (company, index) => {
          const companyId = await SouthernAppAPI.createCompany({ data: company })
          companiesDataToSave[index].id = companyId
        })
        const licitacionId = await SouthernAppAPI.createLicitacion({ data: licitacionDataToSave })
        licitacionDetails.forEach(async (detail, index) => {
          const company = companiesDataToSave.find(company => company.name === detail.company_name)
          const product = productsDataToSave.find(product => product.name === detail.product_name)

          licitacionDetails[index].licitacion_id = licitacionId
          licitacionDetails[index].company_id = company.id
          licitacionDetails[index].producto_id = product.id
          licitacionDetails[index].producto_position = product.position

          const licitacionDetailId = await SouthernAppAPI.createDetalleLicitacion({ data: licitacionDetails[index] })
          licitacionDetails[index].id = licitacionDetailId
        })

        this.setLicitacionData({ data: licitacionDataToSave })
        this.setLicitacionDetails({ licitacionDetails: getLicitacionDetailsCompared(licitacionDetails, productsDataToSave) })
        this.setCompanies({ data: companiesDataToSave })
        this.setProducts({ products: productsDataToSave })
      } catch (error) {

      }
    },
    async deleteFullData () {
      const companies = await SouthernAppAPI.getCompanies()
      const products = await SouthernAppAPI.getProducts()
      const licitacion = await SouthernAppAPI.getLicitacion()
      const licitacionDetails = await SouthernAppAPI.getLicitacionDetails()
      licitacionDetails.forEach(async (detail) => {
        await SouthernAppAPI.deleteLicitacionDetailById({ detailLicitacionId: detail.id })
      })
      licitacion.forEach(async (licitacion) => {
        await SouthernAppAPI.deleteLicitacionById({ licitacionId: licitacion.id })
      })
      products.forEach(async (product) => {
        await SouthernAppAPI.deleteProductById({ productId: product.id })
      })
      companies.forEach(async (company) => {
        await SouthernAppAPI.deleteCompanyById({ companyId: company.id })
      })
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
