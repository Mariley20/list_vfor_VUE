<template>
  <div>
    <input
      id="input"
      type="file"
      @change="uploadExcelFile($event)"
    >
    <div class="overflow-auto">
      <table
        id="Table2XLSX"
        class="sheet-table caption"
      >
        <tbody>
          <template v-for="(row, i) in firstWorksheetRows">
            <WorkSheetRow
              v-if="row.length > 0"
              :key="i"
              :row-data="row"
              :worksheet-ref="firstWorksheetRef"
            />
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import WorkSheetRow from '@/components/WorkSheetRow.vue'

import { read, utils } from 'xlsx'

export default {
  name: 'HomeView',
  components: { WorkSheetRow },
  data () {
    return {
      excelData: [],
      excelFile: null,
      sheetRows: [],
      sheetRowsTender: [],
      sheetRowsProviders: [],
      sheetRowsProducts: [],
      firstWorksheetRows: [],
      firstWorksheetRef: null
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
        const range = utils.decode_range(firstWorksheet['!ref'] || 'A1')
        this.firstWorksheetRef = {
          ref: firstWorksheet['!ref'],
          cols: range.e.c,
          rows: range.e.r
        }

        const firstWorksheetData = utils.sheet_to_json(firstWorksheet, { header: 1, nullError: true })
        this.firstWorksheetRows = firstWorksheetData
      }
      fileReader.readAsArrayBuffer(selectedXlsxFile)
    }
  }
}

/*
- helper yo le envio un numero 1 => A
5 => E
25 => Y
26 = AA
51 = BA
num > 25
prefix
*/
</script>
<style lang="scss" scoped>
.sheet-table {
  border:1px solid black;
  border-collapse:collapse;
}
</style>
