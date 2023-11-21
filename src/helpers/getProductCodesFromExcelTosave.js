const __EMPTY_4 = '__EMPTY_4'
const __EMPTY_10 = '__EMPTY_10'
const __EMPTY_13 = '__EMPTY_13'
const __EMPTY_14 = '__EMPTY_14'
const __EMPTY_18 = '__EMPTY_18'
const __EMPTY_19 = '__EMPTY_19'
const __EMPTY_21 = '__EMPTY_21'

const getProductCodesFromExcelTosave = (rows, products, details) => {
  const rawData = rows.filter((row, index) => index > 0 && row && !!row[__EMPTY_10])
  const productsCodes = rawData.map((row) => {
    const numeroOferta = row && !!row['Document Number'] ? row['Document Number'] : '0'
    const position = row && !!row[__EMPTY_4] ? row[__EMPTY_4] : '0'
    const code = row && !!row[__EMPTY_10] ? row[__EMPTY_10].slice(-8) : ''
    const cantidad = row && !!row[__EMPTY_18] ? row[__EMPTY_18] : ''
    const name = row && !!row[__EMPTY_13] ? row[__EMPTY_13] : ''
    const idCategoria = row && !!row[__EMPTY_14] ? row[__EMPTY_14] : ''
    const unidad = row && !!row[__EMPTY_19] ? row[__EMPTY_19] : ''
    const priceNeto = row && !!row[__EMPTY_21] ? row[__EMPTY_21] : 0

    // console.log(numeroOferta)
    return {
      name: name.trim(),
      code_position: parseInt(position),
      code,
      codePriceNeto: parseFloat(priceNeto),
      codeNumeroOferta: numeroOferta,
      cantidad: parseInt(cantidad),
      idCategoria: idCategoria.trim(),
      unidad: unidad.trim()
    }
  })
  console.log({ productsCodes })
  const newProducts = products.map((product, index) => {
    const productDetails = details.filter(item => item.producto_id === product.id)
    const productCode = productsCodes.find(item => {
      const productWithOferta = productDetails.find(detail => detail.company_numero_de_oferta === item.codeNumeroOferta)
      return !!productWithOferta && item.name.toLowerCase() === product.name.toLowerCase() &&
        item.unidad === product.unidad &&
        item.idCategoria === product.id_categoria &&
        item.cantidad === product.cantidad && productWithOferta.price === item.codePriceNeto
    })
    return {
      ...product,
      ...productCode
    }
  })
  // console.log({ newProducts })

  return newProducts
}

export default getProductCodesFromExcelTosave
