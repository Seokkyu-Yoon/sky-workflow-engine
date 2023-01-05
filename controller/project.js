export function Controller (make, service) {
  return {
    add: make(async (req, res) => {
      const { id, name, description } = req.body
      const result = await service.project.add({ id, name, description })
      res.send(result)
    }),
    getList: make(async (req, res) => {
      const result = await service.project.getList()
      res.send(result)
    }),
    get: make(async (req, res) => {
      const { id } = req.params
      const result = await service.project.get(id)
      res.send(result)
    }),
    // getWorkflows: make(async (req, res) => {
    //   const { id } = req.params
    //   const result = await service.workflow.getList(id)
    //   res.send(result)
    // }),
    // getAlgorithms: make(async (req, res) => {
    //   const { id } = req.params
    //   const result = await service.algorithm.getList(id)
    //   res.send(result)
    // }),
    update: make(async (req, res) => {
      const { id } = req.params
      const { name, description } = req.body
      const result = await service.project.update({ id, name, description })
      res.send(result)
    }),
    delete: make(async (req, res) => {
      const { id } = req.params
      const result = await service.project.delete(id)
      res.send(result)
    })
  }
}
