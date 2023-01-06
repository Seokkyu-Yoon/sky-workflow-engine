export function Controller (make, service) {
  return {
    run: make((req, res) => {
      const result = service.run(req.body)
      res.send(result)
    }),
    stop: make(async (req, res) => {
      const { id } = req.params
      const result = await service.stop(id)
      res.send(result)
    }),
    status: make((req, res) => {
      const { id } = req.params
      const result = service.status(id)
      res.send(result)
    })
  }
}
