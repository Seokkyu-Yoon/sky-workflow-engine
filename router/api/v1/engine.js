export function Router (Router, controller) {
  const router = Router()

  router
    .post('/', controller.run)

  router
    .get('/:id', controller.status)
    .post('/:id', controller.stop)
  return router
}
