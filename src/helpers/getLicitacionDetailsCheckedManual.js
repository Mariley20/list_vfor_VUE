
const getLicitacionDetailsCheckedManual = (licitacionDetails, licitacionId) => {
  const licitacionDetailChecked = licitacionDetails.find(item => item.id === licitacionId)
  const licitacionDetailCheckedProductId = licitacionDetailChecked.producto_id

  licitacionDetails.forEach((detail, index) => {
    if (detail.id === licitacionDetailChecked.id) {
      licitacionDetails[index].better_dias_de_entrega = true
      licitacionDetails[index].better_price_landed = true
    }
    if (detail.id !== licitacionDetailChecked.id && detail.producto_id === licitacionDetailCheckedProductId) {
      licitacionDetails[index].better_dias_de_entrega = false
      licitacionDetails[index].better_price_landed = false
    }
  })

  return licitacionDetails
}

export default getLicitacionDetailsCheckedManual
