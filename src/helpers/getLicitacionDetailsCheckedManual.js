
const getLicitacionDetailsCheckedManual = (licitacionDetails, licitacionUuid) => {
  const licitacionDetailChecked = licitacionDetails.find(item => item.uuid === licitacionUuid)
  const licitacionDetailCheckedProductId = licitacionDetailChecked.producto_id

  licitacionDetails.forEach((detail, index) => {
    if (detail.uuid === licitacionDetailChecked.uuid) {
      licitacionDetails[index].better_dias_de_entrega = true
      licitacionDetails[index].better_price_landed = true
    }
    if (detail.uuid !== licitacionDetailChecked.uuid && detail.producto_id === licitacionDetailCheckedProductId) {
      licitacionDetails[index].better_dias_de_entrega = false
      licitacionDetails[index].better_price_landed = false
    }
  })

  return licitacionDetails
}

export default getLicitacionDetailsCheckedManual
