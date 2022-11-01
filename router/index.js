import { Router as ExpressRouter } from 'express'

import { Router as RouterApi } from './api/index.js'

import { Controllers } from '../controller/index.js'
import { services } from '../service/index.js'

export function Router () {
  const router = ExpressRouter()
  const controllers = Controllers(services)
  router
    .use('/api', RouterApi(controllers))
    .use('/', controllers.render.render)
    .use(controllers.error.error)
  return router
}
