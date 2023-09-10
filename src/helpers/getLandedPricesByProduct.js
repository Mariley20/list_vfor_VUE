import { NET_PRICE, LANDED_PRICE } from '@/constants/settings'
import getProductByProvider from '@/helpers/getProductByProvider'

const getLandedPricesByProduct = (productRows, providerId, factorLandedValue) => {
  const products = getProductByProvider(productRows)[providerId]

  const netPriceIndex = productRows[0].findIndex(item => item.value === NET_PRICE)
  const landedPriceIndex = productRows[0].findIndex(item => item.value === LANDED_PRICE)

  const items = []
  products.forEach((row, index) => {
    if (index > 0) {
      const landedPriceItem = row[landedPriceIndex]
      const netPriceItem = row[netPriceIndex]
      landedPriceItem.value = Math.round((netPriceItem.value + (netPriceItem.value * factorLandedValue)) * 100) / 100

      items.push(landedPriceItem)
    }
  })

  return items
}

export default getLandedPricesByProduct
