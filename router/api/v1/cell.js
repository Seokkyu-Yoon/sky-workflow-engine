import { Router as ExpressRouter } from 'express'

export function Router (controllers) {
  const router = ExpressRouter()

  router
    .post('/', controllers.cell.add)
    .get('/', controllers.cell.getList)

  router
    .get('/:id', controllers.cell.get)
    .put('/:id', controllers.cell.update)
    .delete('/:id', controllers.cell.delete)
  return router
}
