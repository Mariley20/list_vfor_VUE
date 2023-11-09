<template>
  <v-container fluid>
    <div class="overflow-auto">
      <AppLicitacionSeccion />
      <AppPrintCompaniesSection />
    </div>
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
    AppPrintCompaniesSection: () => import('@/components/AppPrintCompaniesSection.vue')
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
  methods: {
    ...mapActions({
      setLicitacionData: 'licitacion/setLicitacionData',
      setLicitacionDetails: 'licitacion/setLicitacionDetails',
      setProducts: 'licitacion/setProducts',
      setCompanies: 'licitacion/setCompanies'
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

      try {
        licitacionDetails.forEach(async (detail, index) => {
          const company = companiesDataToSave.find(company => company.name === detail.company_name)
          const product = productsDataToSave.find(product => product.name === detail.product_name)

          licitacionDetails[index].licitacion_id = licitacionDataToSave.id
          licitacionDetails[index].company_id = company.id
          licitacionDetails[index].producto_id = product.id
          licitacionDetails[index].producto_position = product.position
        })

        this.setLicitacionData({ data: licitacionDataToSave })
        this.setLicitacionDetails({ licitacionDetails: getLicitacionDetailsCompared(licitacionDetails, productsDataToSave) })
        this.setCompanies({ data: companiesDataToSave })
        this.setProducts({ products: productsDataToSave })
      } catch (error) {

      }
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
