export function Controller (make, service) {
  return {
    add: make(async (req, res) => {
      // const { id, projectId, name, description, inputs, outputs, params } = req.body
      const result = await service.add(req.body)
      res.send(result)
    }),
    getList: make(async (req, res) => {
      const { project_id: projectId = null } = req.query
      const result = await service.getList(projectId)
      res.send(result)
    }),
    get: make(async (req, res) => {
      const { id } = req.params
      const result = await service.get(id)
      res.send(result)
    }),
    update: make(async (req, res) => {
      const { id } = req.params
      // const { projectId, name, description, inputs, outputs, params } = req.body
      const result = await service.update({ ...req.body, id })
      res.send(result)
    }),
    delete: make(async (req, res) => {
      const { id } = req.params
      const result = await service.delete(id)
      res.send(result)
    })
  }
}
