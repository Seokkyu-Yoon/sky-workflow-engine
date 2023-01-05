export function Controller (make, service) {
  return {
    add: make(async (req, res) => {
      // const { id, projectId, name, description, inputs, outputs, params } = req.body
      const result = await service.algorithm.add(req.body)
      res.send(result)
    }),
    getList: make(async (req, res) => {
      const result = await service.algorithm.getList()
      res.send(result)
    }),
    get: make(async (req, res) => {
      const { id } = req.params
      const result = await service.algorithm.get(id)
      res.send(result)
    }),
    update: make(async (req, res) => {
      const { id } = req.params
      // const { projectId, name, description, inputs, outputs, params } = req.body
      const result = await service.algorithm.update({ ...req.body, id })
      res.send(result)
    }),
    delete: make(async (req, res) => {
      const { id } = req.params
      const result = await service.algorithm.delete(id)
      res.send(result)
    })
  }
}
