import { SHORT_TEXT } from '@/constants/settings'

const getProductRows = (rows) => {
  const firstRowIndex = rows.findIndex(row => !!row.length && row[0].value === SHORT_TEXT)

  return rows.slice(firstRowIndex)
}

export default getProductRows
