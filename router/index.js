
import { Router as RouterApi } from './api/index.js'

export function Router (Router, controller) {
  const router = Router()
  const controllerRender = controller.render
  const controllerError = controller.error

  router
    .use('/api', RouterApi(Router, controller))
    .use('/', controllerRender.send)
    .use(controllerError.get)
  return router
}
