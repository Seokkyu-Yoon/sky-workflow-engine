import { Router as ExpressRouter } from 'express'

export function Router (controllers) {
  const router = ExpressRouter()

  router
    .post('/', controllers.workflow.add)
    .get('/', controllers.workflow.getList)

  router
    .get('/:id', controllers.workflow.get)
    .put('/:id', controllers.workflow.update)
    .delete('/:id', controllers.workflow.delete)

  router
    .get('/:id/ui', controllers.workflow.getUi)
  return router
}
