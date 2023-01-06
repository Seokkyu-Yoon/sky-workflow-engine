export function Controller (make, service) {
  return {
    add: make(async (req, res) => {
      const { id, projectId, name, description, uiSchema } = req.body
      const result = await service.workflow.add({ id, projectId, name, description, uiSchema })
      res.send(result)
    }),
    getList: make(async (req, res) => {
      const { project_id: projectId = null } = req.query
      const result = await service.workflow.getList(projectId)
      res.send(result)
    }),
    get: make(async (req, res) => {
      const { id } = req.params
      const result = await service.workflow.get(id)
      res.send(result)
    }),
    getUi: make(async (req, res) => {
      const { id } = req.params
      const result = await service.workflow.get(id)
      res.send(result)
    }),
    update: make(async (req, res) => {
      const { id } = req.params
      const { projectId, name, description, uiSchema } = req.body
      const result = await service.workflow.update({ id, projectId, name, description, uiSchema })
      res.send(result)
    }),
    delete: make(async (req, res) => {
      const { id } = req.params
      const result = await service.workflow.delete(id)
      res.send(result)
    })
  }
}
