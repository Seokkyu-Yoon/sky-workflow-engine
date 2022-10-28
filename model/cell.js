import { v4 as uuidv4 } from 'uuid'

import { logger } from '../module/index.js'

export function Model (cellInfo) {
  // [TODO] check cellInfo
  logger.debug(cellInfo)
  const projectId = cellInfo?.projectId || null
  const workflowId = cellInfo?.workflowId || null
  const cellId = cellInfo?.cellId || uuidv4()
  const inputs = cellInfo?.inputs || null
  const outputs = cellInfo?.outputs || null
  const params = cellInfo?.params || null

  return {
    projectId,
    workflowId,
    cellId,
    inputs,
    outputs,
    params
  }
}
