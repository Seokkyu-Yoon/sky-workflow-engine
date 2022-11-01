import { v4 as uuidv4 } from 'uuid'

import { logger } from '../module/index.js'

export function Model (workflowInfo) {
  if (workflowInfo === null) throw new Error('workflowInfo is empty')
  // [TODO] check workflowInfo
  logger.debug(workflowInfo)
  const id = workflowInfo?.id || uuidv4()
  const projectId = workflowInfo?.projectId || null
  const name = workflowInfo?.name || null
  const description = workflowInfo?.description || null
  const uiSchema = workflowInfo?.uiSchema || null

  return {
    id,
    projectId,
    name,
    description,
    uiSchema
  }
}
