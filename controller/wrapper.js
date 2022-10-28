import createError from 'http-errors'

/**
 * @param {(req) => {}} callback
 */
export function Wrapper (callback) {
  return (req, res, next) => {
    try {
      const result = callback(req)
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
