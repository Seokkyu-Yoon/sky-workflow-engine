import { Router as ExpressRouter } from 'express'

export function Router (controllers) {
  const router = ExpressRouter()

  router
    .post('/', controllers.project.add)
    .get('/', controllers.project.getList)

  router
    .get('/:id', controllers.project.get)
    .put('/:id', controllers.project.update)
    .delete('/:id', controllers.project.delete)

  router
    .get('/:id/workflows', controllers.project.getWorkflows)
    .get('/:id/cells', controllers.project.getCells)
  return router
}
