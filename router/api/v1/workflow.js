import { Router as ExpressRouter } from 'express'

export function Router (controllers) {
  const router = ExpressRouter()

  router
    .post('/', controllers.workflow.add)
    .get('/', controllers.workflow.getList)

  router
    .get('/:workflowId', controllers.workflow.get)
    .put('/:workflowId', controllers.workflow.update)
    .delete('/:workflowId', controllers.workflow.delete)

  router
    .get('/:workflowId/ui', controllers.workflow.getUi)
  return router
}
