import createError from 'http-errors'

function Request (request, { params, query, body } = {}) {
  return Object.assign(request, {
    params: params || request.params || {},
    query: query || request.query || {},
    body: body || request.body || {}
  })
}
function Response (response, { end, send, status, render } = {}) {
  return Object.assign(response, {
    end: end || response.end || (() => {}),
    send: send || response.send || (() => {}),
    status: status || response.status || (() => {}),
    render: render || response.render || (() => {})
  })
}

const squelize = {
  express: (reqExpress, resExpress) => {
    const req = Request(reqExpress)
    const res = Response(resExpress)
    return {
      req,
      res
    }
  }
}

function ExpressController (reqExpress, resExpress, nextExpress) {
  function next (err) {
    return err ? nextExpress(createError(err)) : nextExpress()
  }

  const { req, res } = squelize.express(reqExpress, resExpress)
  return { req, res, next }
}

function isFunction (func) {
  return typeof func === 'function'
}
function isAsyncFunction (func) {
  if (!isFunction(func)) throw new Error('func is not a function')
  return func.constructor.name === 'AsyncFunction'
}

export function Factory (type = 'express') {
  let Controller = null
  if (type === 'express') Controller = ExpressController

  if (Controller === null) throw new Error(`${type} is not defined factory type`)

  return callback => {
    if (!isFunction(callback)) throw new Error('callback must be a function')

    return (...data) => {
      const { req, res, next } = Controller(...data)
      if (isAsyncFunction(callback)) {
        callback(req, res, next).catch(next)
        return
      }
      try {
        callback(req, res, next)
      } catch (err) {
        next(err)
      }
    }
  }
}
