import fs from 'node:fs'

function _noop () {}

const loggerStd = new console.Console({
  stdout: process.stdout,
  stderr: process.stderr
})

const loggerFile = process.env.LOGGER_SAVE_AS_FILE
  ? new console.Console({
    stdout: fs.createWriteStream(process.env.LOGGER_STDOUT_PATH),
    stderr: fs.createWriteStream(process.env.LOGGER_STDERR_PATH)
  })
  : {
      debug: _noop,
      log: _noop,
      info: _noop,
      warn: _noop,
      error: _noop
    }

function getTimeStamp (objDate = new Date()) {
  const years = String(objDate.getFullYear()).padStart(4, '0')
  const months = String(objDate.getMonth() + 1).padStart(2, '0')
  const dates = String(objDate.getDate()).padStart(2, '0')
  const hours = String(objDate.getHours()).padStart(2, '0')
  const minutes = String(objDate.getMinutes()).padStart(2, '0')
  const seconds = String(objDate.getSeconds()).padStart(2, '0')
  const milliseconds = String(objDate.getMilliseconds()).padStart(3, '0')
  return `${years}-${months}-${dates}T${hours}:${minutes}:${seconds}.${milliseconds}Z`
}

export function Logger () {
  const logTypes = ['debug', 'log', 'info', 'warn', 'error']

  return logTypes.reduce((logger, type) => {
    logger[type] = (...data) => {
      const timeStamp = getTimeStamp()
      const line = ((new Error('log').stack.split('\n')[2] || '...').match(/\(([^)]+)\)/) || [null, 'not found'])[1]
      const params = [`[${timeStamp}](${line})`, ...data]
      loggerStd[type].apply(loggerStd, params)
      loggerFile[type].apply(loggerFile, params)
    }
    return logger
  }, {})
}
