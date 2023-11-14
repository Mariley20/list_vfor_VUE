import { v4 as uuidv4 } from 'uuid'

const CANTIDAD_SOLICITADA = '" Cantidad solicitada "'
const FRABRICANTE_1 = 'Fabricante1'
const N_PARTE_1 = 'N_Parte1'
const MATERIAL = 'Material'
const UNIDAD_DE_MEDIDA = 'Unidad de medida'
const ULTIMO_PROV_SAP = 'Ultimo prov SAP'
const ULTIMO_PRECIO_SAP = 'Ultimo precio SAP'
const ULTIMO_MONEDA_SAD = 'Ultimo moneda SAP'
const FECHA_ULTIMO_PEDIDO = 'Fecha ultimo pedido'

const getHistoricoFromExcelTosave = (rows, products, details) => {
  const historicos = []
  rows.forEach((row, index) => {
    const rowMaterial = row[MATERIAL]
    const product = products.find(product => product.code === rowMaterial)
    if (!product) return
    console.log(product)
    const detail = details.find(detail => detail.producto_id === product.id)
    if (!detail) return

    const variacion = (detail.price - (row[ULTIMO_PRECIO_SAP] || 0)) / (row[ULTIMO_PRECIO_SAP] || 0)
    const variacionMonedaRound = Math.round((detail.price - (row[ULTIMO_PRECIO_SAP] || 0)) * 100) / 100

    const data = {
      id: uuidv4(),
      material: product.code,
      cantidad: product.cantidad,
      productName: product.name,
      priceCurrent: detail.price,
      companyNameCurrent: detail.company_name,
      productId: product.id,
      companyId: detail.company_id,
      variacionPercentage: (row[ULTIMO_PRECIO_SAP] || 0) > 0 ? Math.round(variacion * 100) / 100 : 0,
      variacionMoneda: variacionMonedaRound,
      fabricante: row[FRABRICANTE_1],
      fechaUltimoPedido: row[FECHA_ULTIMO_PEDIDO],
      nParte1: row[N_PARTE_1],
      cantidadSolicitada: row[CANTIDAD_SOLICITADA],
      unidadDeMedida: row[UNIDAD_DE_MEDIDA],
      ultimoProvSap: row[ULTIMO_PROV_SAP],
      ultimoPrecioSap: row[ULTIMO_PRECIO_SAP] || 0,
      ultimoMonedaSap: row[ULTIMO_MONEDA_SAD]
    }
    historicos.push(data)
  })
  return historicos
}

export default getHistoricoFromExcelTosave
