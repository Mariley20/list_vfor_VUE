import { DOWNLOAD_DATE, FULL_OFFER_VALUE } from '@/constants/settings'
import { v4 as uuidv4 } from 'uuid'

const getCompaniesFromExcelTosave = (rows) => {
  const firstRowIndex = rows.findIndex(row => !!row.length && row[0] === DOWNLOAD_DATE)
  const lastRowIndex = rows.findIndex(row => !!row.length && row[0] === FULL_OFFER_VALUE)

  const providerRowsParsed = rows.slice(firstRowIndex + 1, lastRowIndex + 1)

  const companyColIndex = []
  providerRowsParsed[0].forEach((value, index) => {
    if (value) {
      companyColIndex.push(index)
    }
  })
  const companiesDataToSave = []

  companyColIndex.forEach((index, i) => {
    const data = {
      id: uuidv4(),
      name: providerRowsParsed[0][index],
      moneda_de_la_oferta: providerRowsParsed[1][index],
      cond_de_pago: providerRowsParsed[2][index],
      costo_de_embalaje: providerRowsParsed[3][index],
      costo_de_flete: providerRowsParsed[4][index],
      vig_de_cotizacion: providerRowsParsed[5][index],
      descripcion: providerRowsParsed[6][index],
      numero_de_oferta: providerRowsParsed[7][index].trim(),
      valor_total_final: providerRowsParsed[8][index],
      valor_neto_anterior: providerRowsParsed[9][index],
      ponderacion_tecnica: providerRowsParsed[10][index],
      tipo_de_cambio: providerRowsParsed[11][index],
      incoterm: providerRowsParsed[12][index],
      valor_total_de_la_oferta: providerRowsParsed[13][index],
      factor_landed: 0,
      comment: ''
    }

    companiesDataToSave.push(data)
  })

  return companiesDataToSave
}

export default getCompaniesFromExcelTosave
