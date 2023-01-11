export function Controller (make, service) {
  return {
    run: make(async (req, res) => {
      const result = await service.run(req.body)
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
    }),
    get: make((req, res) => {
      const { id } = req.params
      const result = service.get(id)
      res.send(result)
    })
  }
}
