import { logger } from '../module/index.js'

export function Model (algorithmInfo) {
  if (algorithmInfo === null) throw new Error('algorithmInfo is empty')
  // [TODO] check algorithmlInfo
  logger.debug(algorithmInfo)
  return algorithmInfo
}
