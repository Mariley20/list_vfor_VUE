import { SHORT_TEXT } from '@/constants/settings'

const getProductsDataFromExcelTosave = (rows) => {
  const firstRowIndex = rows.findIndex(row => !!row.length && row[0] === SHORT_TEXT)
  const productRowsParsed = rows.slice(firstRowIndex + 1)
  const productsDataToSave = []

  productRowsParsed.forEach((row, index) => {
    const data = {
      name: row[0],
      code: '',
      position: index
    }
    productsDataToSave.push(data)
  })
  return productsDataToSave
}

export default getProductsDataFromExcelTosave
