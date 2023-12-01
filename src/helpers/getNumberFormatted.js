const getNumberFormatted = (number) => {
  console.log('helper, formate', number)
  const numberParse = typeof number === 'number' ? number : parseFloat(number)

  return new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2 }).format(numberParse)
}

export default getNumberFormatted
