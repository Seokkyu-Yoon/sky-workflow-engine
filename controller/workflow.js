export function Controller (make, service) {
  return {
    add: make(async (req, res) => {
      const { id, projectId, name, description, uiSchema, spec } = req.body
      const result = await service.add({ id, projectId, name, description, uiSchema, spec })
      res.send(result)
    }),
    getList: make(async (req, res) => {
      const { project_id: projectId = null } = req.query
      console.log(service)
      const result = await service.getList(projectId)
      res.send(result)
    }),
    get: make(async (req, res) => {
      const { id } = req.params
      const result = await service.get(id)
      res.send(result)
    }),
    getUi: make(async (req, res) => {
      const { id } = req.params
      const result = await service.get(id)
      res.send(result)
    }),
    update: make(async (req, res) => {
      const { id } = req.params
      const { projectId, name, description, uiSchema, spec } = req.body
      const result = await service.update({ id, projectId, name, description, uiSchema, spec })
      res.send(result)
    }),
    delete: make(async (req, res) => {
      const { id } = req.params
      const result = await service.delete(id)
      res.send(result)
    }),
    getOutput: make(async (req, res) => {
      const { id, nodeId, portId } = req.params
      const { start = 0, limit = 10 } = req.query
      const result = await service.getOutput(id, nodeId, portId, start, limit)
      res.send(result)
    })
  }
}
