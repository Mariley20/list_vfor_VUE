import {
  SHORT_TEXT, NET_WORTH, DELIVERY_DAYS, LANDED_PRICE, NET_PRICE,
  MONEDA, UNIT, TIPO_DE_PROCESO, CAT_PRODUCTO
} from '@/constants/settings'

const getProductRows = (rows) => {
  const firstRowIndex = rows.findIndex(row => !!row.length && row[0].value === SHORT_TEXT)

  const productRowsParsed = rows.slice(firstRowIndex)

  const netProductValueIndex = []
  const deliveryDaysIndex = []
  const priceLandedIndex = []
  const priceNetIndex = []
  const indexesTohide = []

  productRowsParsed[0].forEach((item, i) => {
    if ([MONEDA, UNIT, TIPO_DE_PROCESO, CAT_PRODUCTO].includes(item.value)) {
      indexesTohide.push(i)
    }
    if (item.value === NET_WORTH) {
      netProductValueIndex.push(i)
    }
    if (item.value === DELIVERY_DAYS) {
      deliveryDaysIndex.push(i)
    }
    if (item.value === LANDED_PRICE) {
      priceLandedIndex.push(i)
    }
    if (item.value === NET_PRICE) {
      priceNetIndex.push(i)
    }
  })

  /* comparar valores netos */
  productRowsParsed.forEach((row, i) => {
    let counterProvider = 9
    let providerIndex = 1
    row.forEach((item, index) => {
      if (indexesTohide.includes(index)) {
        item.hide = true
      }
      if (index < counterProvider + 1) {
        item.provider = rows[9][providerIndex]

        if (index === counterProvider) {
          counterProvider += 9
          providerIndex += 1
        }
      }
    })
    if (i > 0) {
      // const netItems = row.filter((item, j) => {
      //   return item.value > 0 && netProductValueIndex.includes(j)
      // })
      const landedPriceItems = row.filter((item, j) => {
        return item.value > 0 && priceLandedIndex.includes(j)
      })
      // const priceNetItems = row.filter((item, j) => {
      //   return item.value > 0 && priceNetIndex.includes(j)
      // })
      const deliveryDaysItems = []
      deliveryDaysIndex.forEach((index, j) => {
        if (row[index + 1].value > 0) {
          return deliveryDaysItems.push(row[index])
        }
      })

      // const netValues = netItems.map(item => item.value)
      const priceLandedValues = landedPriceItems.map(item => item.value)
      // const priceNetValues = priceNetItems.map(item => item.value)
      const DeliveryDaysValues = deliveryDaysItems.map(item => parseInt(item.value))
      // const netValueMin = Math.min(...netValues)
      const deliveryDaysValueMin = Math.min(...DeliveryDaysValues)
      const priceLandedValueMin = Math.min(...priceLandedValues)
      // const priceNetValueMin = Math.min(...priceNetValues)

      deliveryDaysIndex.forEach(index => {
        // console.log(parseInt(row[index].value), deliveryDaysValueMin)
        // if (row[index].value === 0) {
        //   productRowsParsed[i][index].background = '#ffc7ce'
        // }
        // if (row[index].value === netValueMin) {
        // productRowsParsed[i][index].background = '#92d050'
        // const deliveryDays = parseInt(row[index - 1].value)
        if (parseInt(row[index].value) === deliveryDaysValueMin && row[index + 1].value > 0) {
          // productRowsParsed[i][index - 1].background = '#92d050'
          // productRowsParsed[i][index - 1].isTheBestOption = true
          productRowsParsed[i][index].isTheBestOption = true
          productRowsParsed[i][index].background = '#ffd859'
          // productRowsParsed[i][index + 4].isTheBestOption = true
        }
        // }
      })
      priceLandedIndex.forEach(index => {
        // if (row[index].value === 0) {
        //   productRowsParsed[i][index].background = '#ffc7ce'
        // }
        if (row[index].value === priceLandedValueMin) {
          productRowsParsed[i][index].background = '#92d050'
          productRowsParsed[i][index].isTheBestOption = true
          productRowsParsed[i][index - 1].isTheBestOption = true
          productRowsParsed[i][index - 5].isTheBestOption = true
          productRowsParsed[i][index - 6].isTheBestOption = true
        }
        // if (row[index - 1].value === priceNetValueMin) {
        //   productRowsParsed[i][index - 1].background = '#92d050'
        //   productRowsParsed[i][index - 1].isTheBestOption = true
        // }
      })
    }
  })
  return productRowsParsed
}

export default getProductRows
