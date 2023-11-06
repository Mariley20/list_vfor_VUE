import { SHORT_TEXT } from '@/constants/settings'
import { v4 as uuidv4 } from 'uuid'

const getProductsDataFromExcelTosave = (rows) => {
  const firstRowIndex = rows.findIndex(row => !!row.length && row[0] === SHORT_TEXT)
  const productRowsParsed = rows.slice(firstRowIndex + 1)
  const productsDataToSave = []

  productRowsParsed.forEach((row, index) => {
    const data = {
      id: uuidv4(),
      name: row[0].trim(),
      code: '',
      position: index,
      last_price: 0,
      cantidad: 0
    }
    productsDataToSave.push(data)
  })
  return productsDataToSave
}

export default getProductsDataFromExcelTosave
