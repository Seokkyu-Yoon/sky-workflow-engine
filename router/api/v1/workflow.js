export function Router (Router, controller) {
  const router = Router()

  router
    .post('/', controller.add)
    .get('/', controller.getList)

  router
    .get('/:id', controller.get)
    .put('/:id', controller.update)
    .delete('/:id', controller.delete)

  router
    .get('/:id/outputs/:nodeId/:portId', controller.getOutput)
  return router
}
