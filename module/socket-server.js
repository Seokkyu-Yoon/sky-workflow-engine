import { WebSocketServer } from 'ws'
// import { Engine } from './engine/index.js'

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
    // const engine = Engine(req, res)
    // engine.run()
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
  let expired = false
  function onSend (expired, data) {
    if (expired) return
    socket.send(JSON.stringify(data))
  }
  let status = 200
  const res = {
    expire: () => { expired = true },
    status: code => {
      status = code
      return res
    },
    emit: (eventName, body) => {
      const data = {
        eventName,
        status,
        body
      }
      onSend(expired, data)
    },
    notify: body => {
      const data = {
        eventName: `${eventName}:notify`,
        status,
        body
      }
      onSend(expired, data)
      return res
    },
    send: body => {
      const data = {
        eventName,
        status,
        body
      }
      onSend(expired, data)
    }
  }
  return res
}
