export function Controller (make, service) {
  return {
    run: make(async (req, res) => {
      const result = await service.run(req.body)
      res.send(result)
    }),
    status: make(async (req, res) => {
      const { id } = req.params
      const result = await service.status(id)
      res.send(result)
    })
  }
}
