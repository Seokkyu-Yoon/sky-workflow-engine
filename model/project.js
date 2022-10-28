import { v4 as uuidv4 } from 'uuid'

import { logger } from '../module/index.js'

export function Model (projectInfo) {
  // [TODO] check projectInfo
  logger.debug(projectInfo)
  const projectId = projectInfo?.projectId || uuidv4()
  const label = projectInfo?.label || null
  const description = projectInfo?.description || null

  return {
    projectId,
    label,
    description
  }
}
