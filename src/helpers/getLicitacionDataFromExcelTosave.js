import { DOWNLOAD_DATE } from '@/constants/settings'

const getLicitacionDataFromExcelTosave = (rows) => {
  const lastRowIndex = rows.findIndex(row => !!row.length && row[0] === DOWNLOAD_DATE)

  const tenderRows = rows.slice(0, lastRowIndex + 1)

  const tenderRowsFiltered = tenderRows.filter(val => val.length > 0)
  const licitacion = {
    numero_de_la_licitacion: tenderRowsFiltered[0][1],
    nombre_de_la_licitacion: tenderRowsFiltered[1][1],
    responsable_de_la_licitacion: tenderRowsFiltered[2][1],
    version_licitación: tenderRowsFiltered[3][1],
    moneda: tenderRowsFiltered[4][1],
    fecha_de_inicio: tenderRowsFiltered[5][1],
    plazo_para_presentacion_de_la_oferta: tenderRowsFiltered[6][1],
    fecha_apertura: tenderRowsFiltered[7][1],
    fecha_de_descarga: tenderRowsFiltered[8][1]
  }

  return licitacion
}

export default getLicitacionDataFromExcelTosave
