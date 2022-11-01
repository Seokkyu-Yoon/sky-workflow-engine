import { Router as ExpressRouter } from 'express'

import { Router as RouterV1 } from './v1/index.js'

export function Router (controllers) {
  const router = ExpressRouter()
  router
    .use('/v1', RouterV1(controllers))

  return router
}
