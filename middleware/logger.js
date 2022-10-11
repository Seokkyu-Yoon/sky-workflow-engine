import { logger } from '@/module'

const delayedSecondsFrom = (startAt = new Date()) => ((new Date().getTime() - startAt.getTime()) / 1000).toFixed(3)

export const Logger = () => {
  return (req, res, next) => {
    const startAt = new Date()
    res.on('finish', () => {
      const method = req?.method
      const url = req?.url
      const statusCode = res?.statusCode
      const seconds = delayedSecondsFrom(startAt)
      logger.info(method, url, statusCode, `${seconds}s`)
    })
    next()
  }
}
