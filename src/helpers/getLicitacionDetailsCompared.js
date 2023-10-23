
const getLicitacionDetailsCompared = (licitacionDetails, products) => {
  const betterDetailsPriceLanded = []
  const betterDetailsDiasDeEntrega = []
  products.forEach(product => {
    const detailsPriceLanded = licitacionDetails
      .filter(detail => detail.producto_id === product.id && detail.price_landed > 0)

    const detailDiasDeEntrega = licitacionDetails
      .filter(detail => detail.producto_id === product.id && detail.dias_de_entrega > 0 && detail.price_landed > 0)

    if (detailsPriceLanded.length >= 1) {
      const detailProductSorted = detailsPriceLanded.sort((a, b) => a.price_landed - b.price_landed)
      betterDetailsPriceLanded.push(detailProductSorted[0])
    }
    if (detailDiasDeEntrega.length >= 1) {
      const detailProductSorted = detailDiasDeEntrega.sort((a, b) => a.dias_de_entrega - b.dias_de_entrega)
      betterDetailsDiasDeEntrega.push(detailProductSorted[0])
    }
  })
  const betterLicitacionDetailIds = betterDetailsPriceLanded.map(item => item.uuid)
  const betterDetailsDiasDeEntregaIds = betterDetailsDiasDeEntrega.map(item => item.uuid)
  licitacionDetails.forEach((detail, index) => {
    licitacionDetails[index].better_dias_de_entrega = betterDetailsDiasDeEntregaIds.includes(detail.uuid)
    licitacionDetails[index].better_price_landed = betterLicitacionDetailIds.includes(detail.uuid)
  })

  return licitacionDetails
}

export default getLicitacionDetailsCompared
