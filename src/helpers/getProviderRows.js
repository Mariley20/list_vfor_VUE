import { DOWNLOAD_DATE, FULL_OFFER_VALUE } from '@/constants/settings'

const getProviderRows = (rows) => {
  const firstRowIndex = rows.findIndex(row => !!row.length && row[0].value === DOWNLOAD_DATE)
  const lastRowIndex = rows.findIndex(row => !!row.length && row[0].value === FULL_OFFER_VALUE)

  return rows.slice(firstRowIndex + 1, lastRowIndex + 1)
}

export default getProviderRows
