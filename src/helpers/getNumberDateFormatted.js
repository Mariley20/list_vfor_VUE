const getNumberDateFormatted = (numeroDeDias) => {
  const diasDesde1900 = 25567 + 1

  const date = new Date((numeroDeDias - diasDesde1900) * 86400 * 1000)

  return date.toLocaleDateString('es-PE')
}

export default getNumberDateFormatted
