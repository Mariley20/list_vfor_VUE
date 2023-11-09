const __EMPTY_4 = '__EMPTY_4'
const __EMPTY_10 = '__EMPTY_10'
const __EMPTY_13 = '__EMPTY_13'
const __EMPTY_14 = '__EMPTY_14'
const __EMPTY_18 = '__EMPTY_18'
const __EMPTY_19 = '__EMPTY_19'

const getProductCodesFromExcelTosave = (rows, products) => {
  const rawData = rows.filter((row, index) => index > 0 && row && !!row[__EMPTY_10])
  const productsCodes = rawData.map((row) => {
    const position = row && !!row[__EMPTY_4] ? row[__EMPTY_4] : '0'
    const code = row && !!row[__EMPTY_10] ? row[__EMPTY_10].slice(-8) : ''
    const cantidad = row && !!row[__EMPTY_18] ? row[__EMPTY_18] : ''
    const name = row && !!row[__EMPTY_13] ? row[__EMPTY_13] : ''
    const idCategoria = row && !!row[__EMPTY_14] ? row[__EMPTY_14] : ''
    const unidad = row && !!row[__EMPTY_19] ? row[__EMPTY_19] : ''
    return {
      name: name.trim(),
      code_position: parseInt(position),
      code,
      cantidad: parseInt(cantidad),
      idCategoria: idCategoria.trim(),
      unidad: unidad.trim()
    }
  })
  const newProducts = products.map((product, index) => {
    const productCode = productsCodes.find(item => {
      return item.name.toLowerCase() === product.name.toLowerCase() &&
        item.unidad === product.unidad &&
        item.idCategoria === product.id_categoria &&
        item.cantidad === product.cantidad
    })
    return {
      ...product,
      ...productCode
    }
  })
  return newProducts
}

export default getProductCodesFromExcelTosave
