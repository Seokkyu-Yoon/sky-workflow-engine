import { Router as ExpressRouter } from 'express'

import { Router as RouterProject } from './project.js'
import { Router as RouterWorkflow } from './workflow.js'
import { Router as RouterCell } from './cell.js'

export function Router (controllers) {
  const router = ExpressRouter()
  router
    .use('/projects', RouterProject(controllers))
    .use('/workflows', RouterWorkflow(controllers))
    .use('/cells', RouterCell(controllers))
  return router
}
