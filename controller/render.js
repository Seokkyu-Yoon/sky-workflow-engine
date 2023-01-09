export function Controller (make) {
  return {
    send: make((req, res, next) => {
      const filename = 'index.html'
      res.render(filename)
    })
  }
}
