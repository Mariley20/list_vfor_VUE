import { SHORT_TEXT, FULL_OFFER_VALUE, AMOUNT, NET_WORTH, FREIGHT_COST } from '@/constants/settings'

const getFirstWorksheetRowsCalculated = (rows) => {
  const newRows = rows
  // const providerFirstRowIndex = rows.findIndex(row => !!row.length && row[0] === DOWNLOAD_DATE)
  const lastRowIndex = rows.findIndex(row => !!row.length && row[0] === FULL_OFFER_VALUE)
  // const providerRowsParsed = rows.slice(providerFirstRowIndex + 1, lastRowIndex + 1)

  const firstRowIndex = rows.findIndex(row => !!row.length && row[0] === SHORT_TEXT)
  const productRowsParsed = rows.slice(firstRowIndex)
  const productByProvider = getProductByProvider(productRowsParsed)

  /* Valor Total de la Oferta  row */
  let counter = 0
  rows[lastRowIndex].forEach((rowValue, colIndex) => {
    if (typeof rowValue === 'number') {
      const products = productByProvider[counter]
      const valorNetoIndex = products[0].findIndex(item => item === NET_WORTH)
      const total = products.reduce((acc, item, index) => {
        if (index > 0) {
          return acc + item[valorNetoIndex]
        }
        return acc + 0
      }, 0)
      newRows[lastRowIndex][colIndex] = total
      counter++
    }
  })

  newRows.forEach((row, rowIndex) => {
    if (row[0] === FREIGHT_COST) {
      /* costo de flete row */
      row.forEach((rowValue, j) => {
        if (typeof rowValue === 'number') {
          newRows[rowIndex][j] = Math.round((newRows[rowIndex + 10][j] * newRows[rowIndex + 3][j]) * 100) / 100
        }
      })
    }
    //   /* Valor total final  row */ calculado de otra manera
    // if (row[0] === PREVIOUS_NET_WORTH) {
    //   /* Valor neto anterior  row */
    //   row.forEach((rowValue, j) => {
    //     if (typeof rowValue === 'number') {
    //       newRows[rowIndex][j] = Math.round((newRows[rowIndex + 4][j] + newRows[rowIndex - 6][j]) * 100) / 100
    //     }
    //   })
    // }
  })

  /* Calcular valor neto */
  const netProductValueIndex = []

  productRowsParsed[0].forEach((item, i) => {
    if (item === NET_WORTH) {
      netProductValueIndex.push(i)
    }
  })
  for (let i = firstRowIndex + 1; i < rows.length; i++) {
    netProductValueIndex.forEach(index => {
      const cantidadValue = rows[i][index + 6]
      const netValue = rows[i][index + 4]
      newRows[i][index] = Math.round((netValue * cantidadValue) * 100) / 100
    })
  }
  return newRows
}

const getProductByProvider = (rowsParsedProducts) => {
  const chunkSizes = []
  rowsParsedProducts[0].forEach((item, index) => {
    if (item === AMOUNT) {
      chunkSizes.push(index + 2)
    }
  })
  let counter = 0
  const providersProducts = []
  while (counter < chunkSizes.length) {
    const chunks = []
    rowsParsedProducts.forEach((item, index) => {
      const indexInit = counter === 0 ? 0 : chunkSizes[counter - 1]
      const indexEnd = chunkSizes[counter]
      const chunk = item.slice(indexInit, indexEnd)
      chunks.push(chunk)
    })
    providersProducts.push(chunks)
    counter++
  }

  return providersProducts
}

export default getFirstWorksheetRowsCalculated
