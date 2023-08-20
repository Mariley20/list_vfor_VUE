<template>
  <div>
    <input
      id="sheetjs-input"
      type="file"
      multiple="false"
      accept="' + SheetJSFT + '"
      @change="onchange"
    >
    <br>
    <button
      id="export-table"
      type="button"
      style="visibility:hidden"
      @click="onexport"
    >
      Export to XLSX
    </button>
    <br>
    <div id="out-table" />
  </div>
</template>

<script>
import { read, utils, writeFile } from 'xlsx'
/* decode_row */
export default {
  methods: {
    onchange: function (evt) {
      const files = evt.target.files
      if (!files || files.length === 0) return

      const file = files[0]

      const reader = new FileReader()
      reader.onload = function (e) {
        // get data
        const bytes = new Uint8Array(e.target.result)

        /* read workbook */
        const wb = read(bytes)

        /* grab first sheet */
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        const range = utils.decode_range(ws['!ref'] || 'A1')
        // this.test1(ws, range)
        console.log(ws, range)

        /* generate HTML */
        const HTML = utils.sheet_to_html(ws)
        const HTML1 = utils.sheet_to_json(ws, { header: 1 })
        console.log(HTML1)
        /* update table */
        document.getElementById('out-table').innerHTML = HTML
        /* show export button */
        document.getElementById('export-table').style.visibility = 'visible'
      }

      reader.readAsArrayBuffer(file)
    },
    onexport: function (evt) {
      /* generate workbook object from table */
      const wb = utils.table_to_book(document.getElementById('out-table').getElementsByTagName('TABLE')[0])
      /* generate file and force a download */
      writeFile(wb, 'sheetjs.xlsx')
    },
    test1 (ws, r) {
      // eslint-disable-next-line no-unused-vars
      const out = []
      for (let R = r.s.r; R <= r.e.r; ++R) out.push(this.make_html_row(ws, r, R))
    }
    // make_html_row (ws, r, R, o) {
    //   const M = (ws['!merges'] || [])
    //   const oo = []
    //   let sp = ({})
    //   const dense = ws['!data'] != null
    //   for (let C = r.s.c; C <= r.e.c; ++C) {
    //     let RS = 0; let CS = 0
    //     for (let j = 0; j < M.length; ++j) {
    //       if (M[j].s.r > R || M[j].s.c > C) continue
    //       if (M[j].e.r < R || M[j].e.c < C) continue
    //       if (M[j].s.r < R || M[j].s.c < C) { RS = -1; break }
    //       RS = M[j].e.r - M[j].s.r + 1; CS = M[j].e.c - M[j].s.c + 1; break
    //     }
    //     if (RS < 0) continue
    //     const coord = encode_col(C) + encode_row(R)
    //     const cell = dense ? (ws['!data'][R] || [])[C] : ws[coord]
    //     /* TODO: html entities */
    //     let w = (cell && cell.v != null) && (cell.h || escapehtml(cell.w || (format_cell(cell), cell.w) || '')) || ''
    //     sp = ({})
    //     if (RS > 1) sp.rowspan = RS
    //     if (CS > 1) sp.colspan = CS
    //     else if (cell) {
    //       sp['data-t'] = cell && cell.t || 'z'
    //       // note: data-v is unaffected by the timezone interpretation
    //       if (cell.v != null) sp['data-v'] = cell.v instanceof Date ? cell.v.toISOString() : cell.v
    //       if (cell.z != null) sp['data-z'] = cell.z
    //       if (cell.l && (cell.l.Target || '#').charAt(0) != '#') w = '<a href="' + escapehtml(cell.l.Target) + '">' + w + '</a>'
    //     }
    //     sp.id = (o.id || 'sjs') + '-' + coord
    //     oo.push(writextag('td', w, sp))
    //   }
    //   const preamble = '<tr>'
    //   return preamble + oo.join('') + '</tr>'
    // }
  }
}
</script>

<style lang="scss" scoped>

</style>
