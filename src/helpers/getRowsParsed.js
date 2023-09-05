import { DOWNLOAD_DATE } from '@/constants/settings'

const getRowsParsed = (rows, columnCount) => {
  const newRows = []
  console.log(rows)
  rows.forEach((row, rowIndex) => {
    const rowHasColspans = getRowHasColspan(row)
    const newRow = row.map((rowValue, colIndex) => {
      const data = {
        value: rowValue,
        rowIndex: rowIndex + 2,
        colIndex
      }
      if (rowValue === DOWNLOAD_DATE) {
        rows[rowIndex + 1][0] = ''
      }
      if (rowHasColspans) {
        return {
          ...data,
          colspan: getColspanValue(colIndex, row, columnCount)
        }
      }
      return data
    })

    const newRowFiltered = newRow.filter(row => !!row)

    newRows.push(newRowFiltered)
  })

  return newRows
}

const getRowHasColspan = (rowData) => {
  const rowDataLength = rowData.length - 1
  if (rowData.every(item => !item)) return false
  return rowData.some((item, index) => {
    const nexItem = index < rowDataLength ? rowData[index + 1] : 'x'
    return (typeof item === 'string' || typeof item === 'number') && !nexItem
  })
}

const getColspanValue = (colIndex, rowData, columnCount) => {
  let colspanCount = 1
  let counter = colIndex + 1

  if (counter === rowData.length) {
    return columnCount - colIndex + 1
  }
  while ((rowData[counter] === undefined || rowData[counter] === null) && counter < rowData.length) {
    colspanCount += 1
    counter += 1
  }

  return colspanCount
}

export default getRowsParsed
