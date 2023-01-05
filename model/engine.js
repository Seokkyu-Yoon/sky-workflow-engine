import { v4 as uuidv4 } from 'uuid'

import { logger } from '../module/index.js'

export function Model (spec) {
  if (spec === null) throw new Error('engineInfo is empty')
  // [TODO] check engineInfo
  logger.debug(spec)
  const id = uuidv4()
  const workflowId = spec?.workflowId
  const nodes = spec?.nodes
  const links = spec?.links
  const runner = null

  return {
    id,
    workflowId,
    nodes,
    links,
    runner
  }
}
