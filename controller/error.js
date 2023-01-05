import createError from 'http-errors'

export function Controller (make, service) {
  return {
    get: (err, req, res, next) => {
      console.log(err)
      // res.status(err.status || 500)
      // res.send(err.message)
      return make((req, res, next) => {
        res.status(err.status || 500)
        res.send(err.message)
      })(req, res, next)
    },
    throw: make((req, res, next) => {
      next(createError(404))
    })
  }
}
