export function Controller (make, service) {
  return {
    add: make(async (req, res) => {
      const { id, name, description } = req.body
      const result = await service.add({ id, name, description })
      res.send(result)
    }),
    getList: make(async (req, res) => {
      const result = await service.getList()
      res.send(result)
    }),
    get: make(async (req, res) => {
      const { id } = req.params
      const result = await service.get(id)
      res.send(result)
    }),
    update: make(async (req, res) => {
      const { id } = req.params
      const { name, description } = req.body
      const result = await service.update({ id, name, description })
      res.send(result)
    }),
    delete: make(async (req, res) => {
      const { id } = req.params
      const result = await service.delete(id)
      res.send(result)
    })
  }
}
