import { DOWNLOAD_DATE } from '@/constants/settings'

const getTenderRows = (rows) => {
  const lastRowIndex = rows.findIndex(row => !!row.length && row[0].value === DOWNLOAD_DATE)

  const tenderRows = rows.slice(0, lastRowIndex + 1)

  return tenderRows
}

export default getTenderRows
