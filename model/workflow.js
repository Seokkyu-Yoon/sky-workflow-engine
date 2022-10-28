import { v4 as uuidv4 } from 'uuid'

import { logger } from '../module/index.js'

export function Model (workflowInfo) {
  // [TODO] check workflowInfo
  logger.debug(workflowInfo)
  const projectId = workflowInfo?.projectId || null
  const workflowId = workflowInfo?.workflowId || uuidv4()
  const label = workflowInfo?.label || null
  const description = workflowInfo?.description || null
  const uiSchema = workflowInfo?.uiSchema || null

  return {
    projectId,
    workflowId,
    label,
    description,
    uiSchema
  }
}
