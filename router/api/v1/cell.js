import { Router as ExpressRouter } from 'express'

export function Router (controllers) {
  const router = ExpressRouter()

  router
    .post('/', controllers.cell.add)
    .get('/', controllers.cell.getList)

  router
    .get('/:cellId', controllers.cell.get)
    .put('/:cellId', controllers.cell.update)
    .delete('/:cellId', controllers.cell.delete)
  return router
}
