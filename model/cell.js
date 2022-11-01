import { v4 as uuidv4 } from 'uuid'

import { logger } from '../module/index.js'

function Param (paramInfo) {
  // [TODO] check paramInfo
  logger.debug(paramInfo)
  const id = paramInfo?.id || uuidv4()
  const type = paramInfo?.type || null
  return {
    id,
    type
  }
}
function Output (outputInfo) {
  // [TODO] check outputInfo
  logger.debug(outputInfo)
  const id = outputInfo?.id || uuidv4()
  const type = outputInfo?.type || null
  return {
    id,
    type
  }
}

function Input (inputInfo) {
  // [TODO] check inputInfo
  logger.debug(inputInfo)
  const id = inputInfo?.id || uuidv4()
  const type = inputInfo?.type || null
  return {
    id,
    type
  }
}

export function Model (cellInfo) {
  if (cellInfo === null) throw new Error('cellInfo is empty')
  // [TODO] check cellInfo
  logger.debug(cellInfo)
  const id = cellInfo?.id || uuidv4()
  const projectId = cellInfo?.projectId || null
  const name = cellInfo?.name || null
  const description = cellInfo?.description || null
  const inputs = (cellInfo?.inputs || []).map(Input)
  const outputs = (cellInfo?.outputs || []).map(Output)
  const params = (cellInfo?.params || []).map(Param)

  return {
    id,
    projectId,
    name,
    description,
    inputs,
    outputs,
    params
  }
}
