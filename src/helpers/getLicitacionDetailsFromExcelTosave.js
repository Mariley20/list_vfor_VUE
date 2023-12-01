import { SHORT_TEXT, DOWNLOAD_DATE } from '@/constants/settings'
import { v4 as uuidv4 } from 'uuid'

const getLicitacionDetailsFromExcelTosave = (rows) => {
  const firstRowIndex = rows.findIndex(row => !!row.length && row[0] === SHORT_TEXT)
  const downloadDateIndex = rows.findIndex(row => !!row.length && row[0] === DOWNLOAD_DATE)

  const companyColIndex = []
  rows[downloadDateIndex + 1].forEach((value, index) => {
    if (value) {
      companyColIndex.push(index)
    }
  })
  const productRowsParsed = rows.slice(firstRowIndex + 1)
  const companiesProducts = []

  companyColIndex.forEach((index) => {
    const details = []
    productRowsParsed.forEach((row, productIndex) => {
      const product = row.slice(index, index + 8)

      const productData = {
        id: uuidv4(),
        licitacion_id: '',
        producto_id: '',
        company_id: '',
        product_name: row[0].trim(),
        company_name: rows[downloadDateIndex + 1][index],
        dias_de_entrega: parseInt(product[0]),
        unidad: product[3],
        product_position: productIndex,
        // tipo_de_proceso: product[4],
        price: product[5],
        cantidad: product[6],
        price_landed: product[5],
        better_dias_de_entrega: false,
        better_price_landed: false,
        manually_selected: false,
        disabled: false
      }

      details.push(productData)
    })
    companiesProducts.push(...details)
  })
  return companiesProducts
}

export default getLicitacionDetailsFromExcelTosave
