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
    // const data = {
    //   company_name: rows[downloadDateIndex + 1][index],
    //   products: []
    // }

    productRowsParsed.forEach((row, productIndex) => {
      const product = row.slice(index, index + 8)

      const productData = {
        uuid: uuidv4(),
        licitacion_id: '',
        producto_id: '',
        company_id: '',
        product_name: row[0],
        company_name: rows[downloadDateIndex + 1][index],
        dias_de_entrega: parseInt(product[0]),
        unidad: product[3],
        // tipo_de_proceso: product[4],
        price: product[5],
        cantidad: product[6],
        price_landed: product[5],
        better_dias_de_entrega: false,
        better_price_landed: false
      }

      companiesProducts.push(productData)
    })

    // companiesProducts.push(data)
  })
  return companiesProducts
}

export default getLicitacionDetailsFromExcelTosave
