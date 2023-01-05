import { Router as V1 } from './v1/index.js'

export function Router (Router, controller) {
  const controllerError = controller.error

  const router = Router()
  router
    .use('/v1', V1(Router, controller))
    .use('/', controllerError.throw)

  return router
}
