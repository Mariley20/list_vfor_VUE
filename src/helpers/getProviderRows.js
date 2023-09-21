import { DOWNLOAD_DATE, FULL_OFFER_VALUE, NET_WORTH, FINAL_FULL_VALUE } from '@/constants/settings'
// import getProductByProvider from '@/helpers/getProductByProvider'

const getProviderRows = (rows, productRowsParsed) => {
  // const providersProducts = getProductByProvider(productRowsParsed)

  const firstRowIndex = rows.findIndex(row => !!row.length && row[0].value === DOWNLOAD_DATE)
  const lastRowIndex = rows.findIndex(row => !!row.length && row[0].value === FULL_OFFER_VALUE)
  const finalFullValueIndex = rows.findIndex(row => !!row.length && row[0].value === FINAL_FULL_VALUE)

  const netProductValueIndex = []

  productRowsParsed[0].forEach((item, i) => {
    if (item.value === NET_WORTH) {
      netProductValueIndex.push(i)
    }
  })

  netProductValueIndex.forEach((netIndex, providerIndex) => {
    const total = productRowsParsed.reduce((acc, item, index) => {
      if (index > 0 && item[netIndex].isTheBestOption) {
        return acc + item[netIndex].value
      }
      return acc + 0
    }, 0)
    rows[finalFullValueIndex][providerIndex + 1].value = total
    rows[finalFullValueIndex][providerIndex + 1].background = '#92d050'
  })
  const providerRowsParsed = rows.slice(firstRowIndex + 1, lastRowIndex + 1)

  return providerRowsParsed
}

export default getProviderRows
