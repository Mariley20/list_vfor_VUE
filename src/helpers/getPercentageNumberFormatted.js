const getPercentageNumberFormatted = (decimal) => {
  const option = {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }

  const formatter = new Intl.NumberFormat('es-PE', option)
  return formatter.format(decimal)
}

export default getPercentageNumberFormatted
