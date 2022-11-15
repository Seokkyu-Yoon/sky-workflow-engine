import '../preload.js'

import http from 'http'

import { app } from '../app.js'
import { logger, SocketServer } from '../module/index.js'

function getPort () {
  const strPort = process.env.PORT
  const numPort = parseInt(strPort, 10)
  if (isNaN(numPort)) return strPort
  if (numPort >= 0) return numPort
  return false
}

const port = getPort()
app.set('port', port)

const server = SocketServer(http.createServer(app))
// const server = SocketIo(http.createServer(app))

const onListening = () => {
  const addr = server.address()
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `http://localhost:${addr.port}`
  logger.debug('listening on', bind)
}
const onError = (err) => {
  if (err.syscall !== 'listen') throw err
  const bind = `${typeof port === 'string' ? 'Pipe' : 'Port'} ${port}`

  switch (err.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`)
      break
    case 'EDDRINUSE':
      logger.error(`${bind} is already in use`)
      break
    default:
      throw err
  }
  process.exit(1)
}

server.on('listening', onListening)
server.on('error', onError)
server.listen(port)
