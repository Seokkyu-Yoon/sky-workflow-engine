import createError from 'http-errors'

export function HttpResponse (res, next) {
  return {
    send: (callback) => {
      try {
        const result = callback()
        if (result instanceof Promise) {
          result.then(result => res.send({ result })).catch(err => {
            throw err
          })
        } else {
          res.send(result)
        }
      } catch (err) {
        next(createError(err))
      }
    }
  }
}
