import { v4 as uuidv4 } from 'uuid'

import { logger } from '../module/index.js'

export function Model (fileInfo) {
  if (fileInfo === null) throw new Error('fileInfo is empty')
  // [TODO] check fileInfo
  logger.debug(fileInfo)
  const id = fileInfo?.id || uuidv4()
  const projectId = fileInfo?.projectId || null
  const workflowId = fileInfo?.workflowId || null
  const name = fileInfo?.name || null
  const extension = fileInfo?.extension || null
  const size = fileInfo?.size || null

  return {
    id,
    projectId,
    workflowId,
    name,
    extension,
    size
  }
}
