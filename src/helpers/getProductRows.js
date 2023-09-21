import { SHORT_TEXT, NET_WORTH, DELIVERY_DAYS } from '@/constants/settings'

const getProductRows = (rows) => {
  const firstRowIndex = rows.findIndex(row => !!row.length && row[0].value === SHORT_TEXT)

  const productRowsParsed = rows.slice(firstRowIndex)

  const netProductValueIndex = []
  const deliveryDaysIndex = []

  productRowsParsed[0].forEach((item, i) => {
    if (item.value === NET_WORTH) {
      netProductValueIndex.push(i)
    }
    if (item.value === DELIVERY_DAYS) {
      deliveryDaysIndex.push(i)
    }
  })

  /* comparar valores netos */
  productRowsParsed.forEach((row, i) => {
    if (i > 0) {
      const netItems = row.filter((item, j) => {
        return item.value > 0 && netProductValueIndex.includes(j)
      })
      const deliveryDaysItems = []
      deliveryDaysIndex.forEach((index, j) => {
        if (row[index + 1].value > 0) {
          return deliveryDaysItems.push(row[index])
        }
      })

      const netValues = netItems.map(item => item.value)
      const DeliveryDaysValues = deliveryDaysItems.map(item => parseInt(item.value))
      const netValueMin = Math.min(...netValues)
      const deliveryDaysValueMin = Math.min(...DeliveryDaysValues)
      netProductValueIndex.forEach(index => {
        if (row[index].value === 0) {
          productRowsParsed[i][index].background = '#ffc7ce'
        }
        if (row[index].value === netValueMin) {
          productRowsParsed[i][index].background = '#92d050'
          const deliveryDays = parseInt(row[index - 1].value)
          if (deliveryDays === deliveryDaysValueMin) {
            productRowsParsed[i][index - 1].background = '#92d050'
            productRowsParsed[i][index - 1].isTheBestOption = true
            productRowsParsed[i][index].isTheBestOption = true
          }
        }
      })
    }
  })

  return productRowsParsed
}

export default getProductRows
