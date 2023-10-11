<template>
  <div>
    <div>
      <input
        id="input"
        type="file"
        @change="uploadExcelFile($event)"
      >
      <v-btn
        v-if="!!firstWorksheet"
        color="pink"
        @click="handleDownloadExcel"
      >
        Download
      </v-btn>
      <v-btn
        v-if="!!firstWorksheet"
        color="success"
        class="mx-4"
        @click="handleDownloadExcel"
      >
        Agregar nueva cotización
      </v-btn>
      <v-btn
        v-if="!!firstWorksheet"
        color="primary"
        @click="showCompativeModal =!showCompativeModal"
      >
        Ver historico
      </v-btn>
    </div>
    <div class="overflow-auto">
      <table class="sheet-table caption">
        <tbody>
          <template v-for="(row, i) in sheetRowsTender">
            <WorkSheetTenderRow
              :key="`tender_${i}`"
              :row-data="row"
              :worksheet-ref="firstWorksheetRef"
            />
          </template>
          <template v-for="(row, j) in sheetRowsProviders">
            <WorkSheetProviderRow
              :key="`provider_${j}`"
              :row-data="row"
              :worksheet-ref="firstWorksheetRef"
              @edit:factor-landed="handleEditFactorLanded($event)"
            />
          </template>
          <template v-for="(row, h) in sheetRowsProducts">
            <WorkSheetProductRow
              :key="`product_${h}`"
              :row-data="row"
              :worksheet-ref="firstWorksheetRef"
            />
          </template>
        </tbody>
      </table>
    </div>
    <ComparativeModal
      v-if="!!firstWorksheet"
      v-model="showCompativeModal"
      :sheet-rows-products="sheetRowsProducts"
    />
    <CellModalEdit
      v-if="!!cellDataToEdit"
      v-model="showCellModalEdit"
      :item="cellDataToEdit"
      @click:edit-cell="handleSaveEditFactorLanded"
    />
  </div>
</template>

<script>
import WorkSheetTenderRow from '@/components/WorkSheetTenderRow.vue'
import WorkSheetProviderRow from '@/components/WorkSheetProviderRow.vue'
import WorkSheetProductRow from '@/components/WorkSheetProductRow.vue'
import CellModalEdit from '@/components/CellModalEdit.vue'
import ComparativeModal from '@/components/ComparativeModal.vue'
import addRowsOrColumns from '@/helpers/addRowsOrColumns'
import getRowsParsed from '@/helpers/getRowsParsed'
import getTenderRows from '@/helpers/getTenderRows'
import getProviderRows from '@/helpers/getProviderRows'
import getProductRows from '@/helpers/getProductRows'
import getFirstWorksheetRowsCalculated from '@/helpers/getFirstWorksheetRowsCalculated'
// import getProductByProvider from '@/helpers/getProductByProvider'
import getLandedPricesByProduct from '@/helpers/getLandedPricesByProduct'
// import { PACKING_COST, FACTOR_LANDED } from '@/constants/settings'

import { read, utils, writeFile } from 'xlsx-js-style'

export default {
  name: 'AboutView',
  components: {
    WorkSheetTenderRow,
    WorkSheetProductRow,
    WorkSheetProviderRow,
    CellModalEdit,
    ComparativeModal
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
  methods: {
    uploadExcelFile (event) {
      const selectedXlsxFile = event.target.files[0]

      const fileReader = new FileReader()

      fileReader.onload = () => {
        const arrayBuffer = fileReader.result

        const workbook = read(arrayBuffer)
        const firstWorksheet = workbook.Sheets[workbook.SheetNames[0]]
        const firstWorksheetData = utils.sheet_to_json(firstWorksheet, { header: 1, nullError: true })

        const newWorksheetJson = addRowsOrColumns(firstWorksheetData)
        const newFirstWorksheet = utils.aoa_to_sheet(newWorksheetJson)

        this.createNewWorksheet(newFirstWorksheet)
      }
      fileReader.readAsArrayBuffer(selectedXlsxFile)
    },
    createNewWorksheet (firstWorksheet) {
      this.firstWorksheetRows = utils.sheet_to_json(firstWorksheet, { header: 1, nullError: true })
      const range = utils.decode_range(firstWorksheet['!ref'] || 'A1')
      this.firstWorksheetRef = {
        ref: firstWorksheet['!ref'],
        cols: range.e.c,
        rows: range.e.r,
        rowStart: range.s.r
      }
      this.firstWorksheetRows = getFirstWorksheetRowsCalculated(this.firstWorksheetRows)
      const rowsparsed = getRowsParsed(this.firstWorksheetRows, range.e.c, range.s.r)
      this.sheetRowsTender = getTenderRows(rowsparsed)
      this.sheetRowsProducts = getProductRows(rowsparsed)
      this.sheetRowsProviders = getProviderRows(rowsparsed, this.sheetRowsProducts)

      /*  */
      this.firstWorksheet = firstWorksheet
    },
    handleDownloadExcel () {
      const wb = utils.book_new()
      utils.book_append_sheet(wb, this.firstWorksheet, 'Sheet1')
      writeFile(wb, 'souther_xxx.xlsx')
    },
    handleEditFactorLanded (item) {
      this.cellDataToEdit = item
      this.showCellModalEdit = true
    },
    handleSaveEditFactorLanded (item) {
      const cellAddress = utils.encode_cell({
        r: item.rowIndex,
        c: item.colIndex
      })

      this.firstWorksheet[cellAddress].v = item.value
      const landedPrices = getLandedPricesByProduct(this.sheetRowsProducts, item.providerId - 1, item.value)

      landedPrices.forEach((element, i) => {
        const landedPriceAddress = utils.encode_cell({
          r: element.rowIndex,
          c: element.colIndex
        })

        this.firstWorksheet[landedPriceAddress].v = element.value
      })

      this.createNewWorksheet(this.firstWorksheet)
      this.cellDataToEdit = null
      this.showCellModalEdit = false
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
