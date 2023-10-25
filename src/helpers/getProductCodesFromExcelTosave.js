const __EMPTY_10 = '__EMPTY_10'
const __EMPTY_13 = '__EMPTY_13'
const __EMPTY_18 = '__EMPTY_18'

const getProductCodesFromExcelTosave = (rows, products) => {
  const rawData = rows.filter((row, index) => index > 0 && row && !!row[__EMPTY_10])

  const productsCodes = rawData.reverse().map((row) => {
    const code = row && !!row[__EMPTY_10] ? row[__EMPTY_10].slice(-9) : ''
    const cantidad = row && !!row[__EMPTY_18] ? row[__EMPTY_18] : ''
    const name = row && !!row[__EMPTY_13] ? row[__EMPTY_13] : ''
    return {
      name,
      code,
      cantidad: parseInt(cantidad)
    }
  })
  const newProducts = products.map((product, index) => {
    return {
      ...product,
      ...productsCodes[index]
    }
  })
  // console.log('xxxx', newProducts)
  return newProducts
}

export default getProductCodesFromExcelTosave
