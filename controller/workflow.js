export function Controller (controllerFactory) {
  return (services) => {
    return {
      add: controllerFactory.make(async (req, res) => {
        const { projectId, label, description, uiSchema } = req.body
        const result = await services.workflow.add({ projectId, label, description, uiSchema })
        res.send(result)
      }),
      getList: controllerFactory.make(async (req, res) => {
        const { projectId = null } = req.params
        const result = await services.workflow.getList(projectId)
        res.send(result)
      }),
      get: controllerFactory.make(async (req, res) => {
        const { workflowId } = req.params
        const result = await services.workflow.get(workflowId)
        res.send(result)
      }),
      getUi: controllerFactory.make(async (req, res) => {
        const { workflowId } = req.params
        const result = await services.workflow.get(workflowId)
        res.send(result)
      }),
      update: controllerFactory.make(async (req, res) => {
        const { workflowId } = req.params
        const { projectId, label, description, uiSchema } = req.body
        const result = await services.workflow.update({ projectId, workflowId, label, description, uiSchema })
        res.send(result)
      }),
      delete: controllerFactory.make(async (req, res) => {
        const { workflowId } = req.params
        const result = await services.workflow.delete(workflowId)
        res.send(result)
      })
    }
  }
}
