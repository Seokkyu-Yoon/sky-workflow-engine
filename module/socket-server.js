import { WebSocketServer } from 'ws'
import { Engine } from './engine.js'

/**
 * @param {import('http').Server} server
 */
export function SocketServer (server) {
  const socketServer = new WebSocketServer({ server })
  socketServer.on('connection', onConnection)
  return server
}

function onConnection (socket) {
  const socketRouter = WebSocketRouter(socket)
  socketRouter.use('run:*', (req, res) => {
    Engine(req, res)
  })
}

function WebSocketRouter (socket) {
  const callbacks = {}
  function use (eventName, controller = (req, res) => {}) {
    callbacks[eventName] = controller
  }
  function emit (e) {
    const { eventName, body } = JSON.parse(e.toString('utf-8'))
    const req = Request(body)
    const res = Response(socket, eventName)
    const cb = callbacks[eventName]
    if (typeof cb !== 'function') return
    cb(req, res)
  }
  socket.on('message', emit)
  return {
    use,
    emit
  }
}

function Request (body) {
  return {
    body
  }
}
function Response (socket, eventName) {
  let status = 200
  const res = {
    status: code => {
      status = code
      return res
    },
    emit: (eventName, body) => socket.send(JSON.stringify({
      eventName,
      status,
      body
    })),
    notify: body => socket.send(JSON.stringify({
      eventName: `${eventName}:notify`,
      status,
      body
    })),
    send: body => socket.send(JSON.stringify({
      eventName,
      status,
      body
    }))
  }
  return res
}
