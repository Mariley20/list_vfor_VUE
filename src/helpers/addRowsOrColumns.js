import {
  DOWNLOAD_DATE, PACKING_COST, SHORT_TEXT,
  NET_PRICE, FACTOR_LANDED, LANDED_PRICE
} from '@/constants/settings'

const addRowsOrColumns = (rows) => {
  const rowsCloned = []

  const downloadDateRowIndex = rows.findIndex(row => row[0] === DOWNLOAD_DATE)
  const shortTextRowIndex = rows.findIndex(row => row[0] === SHORT_TEXT)

  const columnsIndex = rows[shortTextRowIndex].reduce((acc, item, index) => {
    if (item === NET_PRICE) {
      return [...acc, index]
    }
    return [...acc]
  }, [])

  rows.forEach((row, index) => {
    if (index <= downloadDateRowIndex) {
      rowsCloned.push(row)
    }
    if (index > downloadDateRowIndex && index < shortTextRowIndex) {
      const rowCloned = JSON.parse(JSON.stringify(row))
      for (let ii = 0; ii < columnsIndex.length - 1; ii++) {
        rowCloned.splice(columnsIndex[ii] + ii, 0, undefined)
      }
      rowsCloned.push(rowCloned)
    }
    if (index >= shortTextRowIndex) {
      const rowCloned = JSON.parse(JSON.stringify(row))
      columnsIndex.forEach((colIndex, i) => {
        const value = index === shortTextRowIndex ? LANDED_PRICE : row[colIndex]
        rowCloned.splice(colIndex + i + 1, 0, value)
      })
      rowsCloned.push(rowCloned)
    }
  })

  const packingCostRowIndex = rowsCloned.findIndex(row => row[0] === PACKING_COST)
  const factorLandedRow = JSON.parse(JSON.stringify(rowsCloned[packingCostRowIndex]))
  factorLandedRow[0] = FACTOR_LANDED
  rowsCloned.splice(packingCostRowIndex + 4, 0, factorLandedRow)

  return rowsCloned
}

export default addRowsOrColumns
