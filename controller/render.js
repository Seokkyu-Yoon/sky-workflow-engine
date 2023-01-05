export function Controller (make, service) {
  return {
    send: make((req, res, next) => {
      const filename = 'index.html'
      res.render(filename)
    })
  }
}
