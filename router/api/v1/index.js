import { Router as ExpressRouter } from 'express'

import { router as routerProject } from './project.js'
import { router as routerWorkflow } from './workflow.js'

export const router = ExpressRouter()
router
  .use('/projects', routerProject)
  .use('/workflows', routerWorkflow)
