import { v4 as uuidv4 } from 'uuid'

import { logger } from '../module/index.js'

export function Model (cellInfo) {
  // [TODO] check cellInfo
  logger.debug(cellInfo)
  const projectId = cellInfo?.projectId || null
  const cellId = cellInfo?.cellId || uuidv4()
  const label = cellInfo?.label || null
  const description = cellInfo?.description || null
  const inputs = cellInfo?.inputs || null
  const outputs = cellInfo?.outputs || null
  const params = cellInfo?.params || null

  return {
    projectId,
    cellId,
    label,
    description,
    inputs,
    outputs,
    params
  }
}
