import { Router as ExpressRouter } from 'express'

import { Router as RouterApi } from './api/index.js'

import { Controller } from '../controller/index.js'
import * as service from '../service/index.js'

export function Router () {
  const router = ExpressRouter()
  const controller = Controller(service)
  router
    .use('/api', RouterApi(controller))
    .use('/', controller.render.render)
    .use(controller.error.error)
  return router
}
