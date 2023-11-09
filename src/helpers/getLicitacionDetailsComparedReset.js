
import getLicitacionDetailsCompared from '@/helpers/getLicitacionDetailsCompared'

const getLicitacionDetailsComparedReset = (licitacionDetails, products) => {
  const newlicitacionDetails = JSON.parse(JSON.stringify(licitacionDetails))
  newlicitacionDetails.forEach((element, i) => {
    newlicitacionDetails[i].better_dias_de_entrega = false
    newlicitacionDetails[i].better_price_landed = false
    newlicitacionDetails[i].manually_selected = false
    newlicitacionDetails[i].disabled = false
  })

  return getLicitacionDetailsCompared(newlicitacionDetails, products)
}

export default getLicitacionDetailsComparedReset
