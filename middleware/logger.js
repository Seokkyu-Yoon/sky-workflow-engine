import { logger } from '@/module'

const getSeconds = (startAt = new Date()) => ((new Date().getTime() - startAt.getTime()) / 1000).toFixed(3)
const onFinish = (method, url, statusCode, seconds) => logger.info(method, url, statusCode, `${seconds}s`)

export const Logger = (req, res, next) => {
  const startAt = new Date()
  res.on('finish', () => onFinish(req.method, req.url, res.statusCode, getSeconds(startAt)))
  next()
}
