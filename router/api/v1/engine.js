export function Router (Router, controller) {
  const router = Router()

  router
    .post('/', controller.run)
    .get('/:id', controller.status)
    // .delete('/:id', controller.stop)
  return router
}
