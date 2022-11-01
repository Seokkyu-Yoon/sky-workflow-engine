import { Router as ExpressRouter } from 'express'

export function Router (controllers) {
  const router = ExpressRouter()

  router
    .post('/', controllers.project.add)
    .get('/', controllers.project.getList)

  router
    .get('/:projectId', controllers.project.get)
    .put('/:projectId', controllers.project.update)
    .delete('/:projectId', controllers.project.delete)

  router
    .get('/:projectId/workflows', controllers.project.getWorkflows)
    .get('/:projectId/cells', controllers.project.getCells)
  return router
}
