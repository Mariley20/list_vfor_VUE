const __EMPTY_10 = '__EMPTY_10'
const __EMPTY_13 = '__EMPTY_13'

const getProductCodesFromExcelTosave = (rows, products) => {
  products.forEach(product => {
    const productName = product.name.trim()

    const row = rows.find(item => {
      const rowProductName = item[__EMPTY_13] || ''
      return rowProductName.trim() === productName
    })
    product.code = row ? row[__EMPTY_10] || '' : ''
  })
  return products
}

export default getProductCodesFromExcelTosave
