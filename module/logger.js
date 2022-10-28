import path from 'node:path'
import fs from 'node:fs'

const _noop = () => {}

const getTimeStamp = (objDate = new Date()) => {
  const years = String(objDate.getFullYear()).padStart(4, '0')
  const months = String(objDate.getMonth() + 1).padStart(2, '0')
  const dates = String(objDate.getDate()).padStart(2, '0')
  const hours = String(objDate.getHours()).padStart(2, '0')
  const minutes = String(objDate.getMinutes()).padStart(2, '0')
  const seconds = String(objDate.getSeconds()).padStart(2, '0')
  const milliseconds = String(objDate.getMilliseconds()).padStart(3, '0')
  return `${years}-${months}-${dates}T${hours}:${minutes}:${seconds}.${milliseconds}Z`
}

const getCallInfo = () => {
  const errForStack = new Error('logline')
  const [,,,, stackText = null] = errForStack.stack.split('\n')
  if (stackText === null) return 'can\'t trace'

  const [, callInfo = null] = stackText.match(/\(file:\/\/\/([^)]+)\)/) || []
  if (callInfo === null) return 'can\'t trace'
  const arr = callInfo.split(':')
  const col = arr.pop()
  const line = arr.pop()
  const callPath = path.normalize(arr.join(':'))

  return [callPath, line, col].join(':')
}

const getPreData = () => {
  const timeStamp = getTimeStamp()
  const callInfo = getCallInfo()
  return `[${timeStamp}](${callInfo})\n`
}

const LoggerNoop = () => ({
  debug: _noop,
  log: _noop,
  info: _noop,
  warn: _noop,
  error: _noop
})
const LoggerStd = () => new console.Console({
  stdout: process.stdout,
  stderr: process.stderr
})
const LoggerFile = () => {
  if (process.env.LOGGER_SAVE_AS_FILE) {
    const timeStamp = getTimeStamp()
    const logger = new console.Console({
      stdout: fs.createWriteStream(path.resolve(process.env.LOGGER_DIR, `${timeStamp}_log.log`)),
      stderr: fs.createWriteStream(path.resolve(process.env.LOGGER_DIR, `${timeStamp}_error.log`))
    })
    logger.debug = _noop
    return logger
  }
  return LoggerNoop()
}
const Logger = () => {
  const loggerStd = LoggerStd()
  const loggerFile = LoggerFile()

  return {
    debug: (...data) => {
      const logType = 'DEBUG'
      const params = getPreData()
      loggerStd.debug(logType, params, ...data)
      loggerFile.debug(logType, params, ...data)
    },
    log: (...data) => {
      const logType = 'LOG'
      const params = getPreData()
      loggerStd.log(logType, params, ...data)
      loggerFile.log(logType, params, ...data)
    },
    info: (...data) => {
      const logType = 'INFO'
      const params = getPreData()
      loggerStd.info(logType, params, ...data)
      loggerFile.info(logType, params, ...data)
    },
    warn: (...data) => {
      const logType = 'WARN'
      const params = getPreData()
      loggerStd.warn(logType, params, ...data)
      loggerFile.warn(logType, params, ...data)
    },
    error: (...data) => {
      const logType = 'ERROR'
      const params = getPreData()
      loggerStd.error(logType, params, ...data)
      loggerFile.error(logType, params, ...data)
    }
  }
}

export const logger = Logger()
