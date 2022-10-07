import path from 'node:path'
import fs from 'node:fs'

const _noop = () => {}
const loggerStd = new console.Console({
  stdout: process.stdout,
  stderr: process.stderr
})

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

const loggerFile = (() => {
  const timeStamp = getTimeStamp()
  const c = process.env.LOGGER_SAVE_AS_FILE
    ? new console.Console({
      stdout: fs.createWriteStream(path.resolve(process.env.LOGGER_DIR, `${timeStamp}_log.log`)),
      stderr: fs.createWriteStream(path.resolve(process.env.LOGGER_DIR, `${timeStamp}_error.log`))
    })
    : {
        log: _noop,
        info: _noop,
        warn: _noop,
        error: _noop
      }

  c.debug = _noop
  return c
})()

const getCallInfo = () => {
  const errForStack = new Error('logline')
  const [,,, stackText = null] = errForStack.stack.split('\n')
  if (stackText === null) return 'can\'t trace'

  const [, callInfo = null] = stackText.match(/\(([^)]+)\)/) || []
  if (callInfo === null) return 'can\'t trace'
  const arr = callInfo.split(':')
  const col = arr.pop()
  const line = arr.pop()
  const callPath = path.normalize(arr.join(':'))

  return [callPath, line, col].join(':')
}

const logTypes = ['debug', 'log', 'info', 'warn', 'error']
const longestTypeLength = logTypes.reduce((length, logType) => Math.max(length, logType.length), 0)
const formatType = type => type.toUpperCase().padEnd(longestTypeLength, ' ')

export const logger = logTypes.reduce((l, type) => {
  const formattedType = formatType(type)
  l[type] = (...data) => {
    const timeStamp = getTimeStamp()
    const line = getCallInfo()
    const params = [`${formattedType} [${timeStamp}](${line})\n`, ...data]
    loggerStd[type].apply(loggerStd, params)
    loggerFile[type].apply(loggerFile, params)
  }
  return l
}, {})
