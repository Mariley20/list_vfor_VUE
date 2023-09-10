import { AMOUNT } from '@/constants/settings'

const getProductByProvider = (rowsParsedProducts, providerId) => {
  const chunkSizes = []
  rowsParsedProducts[0].forEach((item, index) => {
    if (item.value === AMOUNT) {
      chunkSizes.push(index + 1)
    }
  })
  let counter = 0
  const providersProducts = []
  while (counter < chunkSizes.length) {
    const chunks = []
    rowsParsedProducts.forEach((item, index) => {
      const indexInit = counter === 0 ? 0 : chunkSizes[counter - 1] + 1
      const indexEnd = chunkSizes[counter] + 1
      const chunk = item.slice(indexInit, indexEnd)
      chunks.push(chunk)
    })
    providersProducts.push(chunks)
    counter++
  }

  return providersProducts
}

export default getProductByProvider
