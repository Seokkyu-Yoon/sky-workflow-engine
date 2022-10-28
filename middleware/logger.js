import { logger } from '../module/index.js'

function delayedSecondsFrom (startAt = new Date()) {
  return ((new Date().getTime() - startAt.getTime()) / 1000).toFixed(3)
}

export function Middleware () {
  return (req, res, next) => {
    const startAt = new Date()
    res.on('finish', () => {
      const method = req?.method
      const url = req?.originalUrl
      const statusCode = res?.statusCode
      const seconds = delayedSecondsFrom(startAt)
      logger.info(method, url, statusCode, `${seconds}s`)
    })
    next()
  }
}
