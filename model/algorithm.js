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

export function Model (algorithmInfo) {
  if (algorithmInfo === null) throw new Error('algorithmInfo is empty')
  // [TODO] check algorithmInfo
  logger.debug(algorithmInfo)
  const id = algorithmInfo?.id || uuidv4()
  const projectId = algorithmInfo?.projectId || null
  const name = algorithmInfo?.name || null
  const description = algorithmInfo?.description || null
  // const inputs = (algorithmInfo?.inputs || []).map(Input)
  const inputs = algorithmInfo?.inputs || []
  // const outputs = (algorithmInfo?.outputs || []).map(Output)
  const outputs = algorithmInfo?.outputs || []
  // const params = (algorithmInfo?.params || []).map(Param)
  const params = algorithmInfo?.params || []

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
