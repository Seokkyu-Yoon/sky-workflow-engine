import { ErrorCollector } from './error.js'

export function makeExpressController (callback) {
  function ExpressController (req, res, next) {
    const errorCollector = ErrorCollector(next)
    errorCollector(() => callback(req, res))
  }
  return ExpressController
}

export function Factory (type = 'express') {
  if (type === 'express') return { make: makeExpressController }
  throw new Error(`${type} is not defined factory type`)
}
