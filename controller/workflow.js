export function Controller (controllerFactory) {
  return (services) => {
    return {
      add: controllerFactory.make(async (req, res) => {
        const { id, projectId, name, description, uiSchema } = req.body
        const result = await services.workflow.add({ id, projectId, name, description, uiSchema })
        res.send(result)
      }),
      getList: controllerFactory.make(async (req, res) => {
        const result = await services.workflow.getList()
        res.send(result)
      }),
      get: controllerFactory.make(async (req, res) => {
        const { id } = req.params
        const result = await services.workflow.get(id)
        res.send(result)
      }),
      getUi: controllerFactory.make(async (req, res) => {
        const { id } = req.params
        const result = await services.workflow.get(id)
        res.send(result)
      }),
      update: controllerFactory.make(async (req, res) => {
        const { id } = req.params
        const { projectId, name, description, uiSchema } = req.body
        const result = await services.workflow.update({ id, projectId, name, description, uiSchema })
        res.send(result)
      }),
      delete: controllerFactory.make(async (req, res) => {
        const { id } = req.params
        const result = await services.workflow.delete(id)
        res.send(result)
      })
    }
  }
}
