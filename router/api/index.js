import { Router as ExpressRouter } from 'express'

import { Router as V1 } from './v1/index.js'

export function Router (controllers) {
  const router = ExpressRouter()
  router
    .use('/v1', V1(controllers))

  return router
}
