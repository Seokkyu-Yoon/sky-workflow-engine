import { logger } from '../module/index.js'

export function Model (cellInfo) {
  if (cellInfo === null) throw new Error('cellInfo is empty')
  // [TODO] check cellInfo
  logger.debug(cellInfo)
  return cellInfo
}
