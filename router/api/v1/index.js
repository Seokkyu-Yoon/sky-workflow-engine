import { Router as ExpressRouter } from 'express'

import { Router as Project } from './project.js'
import { Router as Workflow } from './workflow.js'
import { Router as Cell } from './cell.js'

export function Router (controller) {
  const router = ExpressRouter()
  router
    .use('/projects', Project(controller))
    .use('/workflows', Workflow(controller))
    .use('/cells', Cell(controller))
  return router
}
