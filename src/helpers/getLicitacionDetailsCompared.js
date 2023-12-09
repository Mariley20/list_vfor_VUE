
const getLicitacionDetailsCompared = (licitacionDetails, products) => {
  const newlicitacionDetails = JSON.parse(JSON.stringify(licitacionDetails))
  products.forEach(product => {
    const productDetailsAvailable = licitacionDetails
      .filter(detail => detail.producto_id === product.id && detail.disabled === false)
    // console.log(productDetailsAvailable)
    if (productDetailsAvailable.length === 0) return

    const productDetailsAvailableIds = productDetailsAvailable.map(item => item.id)
    const manuallySelectedDetail = productDetailsAvailable.find(item => item.manually_selected === true)
    if (manuallySelectedDetail) {
      newlicitacionDetails.forEach((item, itemIndex) => {
        if (productDetailsAvailableIds.includes(item.id)) {
          // newlicitacionDetails[itemIndex].better_dias_de_entrega = item.id === manuallySelectedDetail.id
          newlicitacionDetails[itemIndex].better_price_landed = item.id === manuallySelectedDetail.id
          newlicitacionDetails[itemIndex].manually_selected = item.id === manuallySelectedDetail.id
        }
      })
      //
    } else {
      /* mejor precio landed */
      const sortedByPriceLanded = productDetailsAvailable
        .filter(item => item.price_landed > 0)
        .sort((a, b) => a.price_landed - b.price_landed)
      /* mejores dias de entrega */
      const sortedByDiasDeEntrega = productDetailsAvailable
        .filter(item => item.dias_de_entrega > 0 && item.price_landed > 0)
        .sort((a, b) => a.dias_de_entrega - b.dias_de_entrega)

      const detailBestPriceLanded = sortedByPriceLanded.length > 0 ? sortedByPriceLanded[0] : null
      const detailBestDiadeEntrega = sortedByDiasDeEntrega.length > 0 ? sortedByDiasDeEntrega[0] : null

      newlicitacionDetails.forEach((item, itemIndex) => {
        if (productDetailsAvailableIds.includes(item.id)) {
          newlicitacionDetails[itemIndex].better_price_landed = !!detailBestPriceLanded && item.id === detailBestPriceLanded.id
          newlicitacionDetails[itemIndex].better_dias_de_entrega = !!detailBestDiadeEntrega && item.id === detailBestDiadeEntrega.id
          newlicitacionDetails[itemIndex].manually_selected = !!detailBestPriceLanded && item.id === detailBestPriceLanded.id
        }
      })
    }
  })

  return newlicitacionDetails
}

export default getLicitacionDetailsCompared
