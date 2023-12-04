const getNumberFormatted = (number) => {
  const numberParse = typeof number === 'number' ? number : parseFloat(number)

  return new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2 }).format(numberParse)
}

export default getNumberFormatted
