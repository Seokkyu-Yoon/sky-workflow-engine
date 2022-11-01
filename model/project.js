import { v4 as uuidv4 } from 'uuid'

import { logger } from '../module/index.js'

export function Model (projectInfo) {
  if (projectInfo === null) throw new Error('projectInfo is empty')
  // [TODO] check projectInfo
  logger.debug(projectInfo)
  const id = projectInfo?.id || uuidv4()
  const name = projectInfo?.name || null
  const description = projectInfo?.description || null

  return {
    id,
    name,
    description
  }
}
