import createError from 'http-errors'
import { logger } from '../module/index.js'

export function ErrorCollector (errorSender) {
  const onError = err => errorSender(Error(err))
  return async callback => {
    try {
      await callback()
    } catch (err) {
      logger.error(err)
      onError(err)
    }
  }
}

function Error (err) {
  // [TODO] onError
  return createError(err)
}
