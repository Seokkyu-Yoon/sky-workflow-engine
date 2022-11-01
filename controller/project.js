export function Controller (controllerFactory) {
  return (services) => {
    return {
      add: controllerFactory.make(async (req, res) => {
        const { label, description } = req.body
        const result = await services.project.add({ label, description })
        res.send(result)
      }),
      getList: controllerFactory.make(async (req, res) => {
        const result = await services.project.getList()
        res.send(result)
      }),
      get: controllerFactory.make(async (req, res) => {
        const { projectId } = req.params
        const result = await services.project.get(projectId)
        res.send(result)
      }),
      getWorkflows: controllerFactory.make(async (req, res) => {
        const { projectId } = req.params
        const result = await services.workflow.getList(projectId)
        res.send(result)
      }),
      getCells: controllerFactory.make(async (req, res) => {
        const { projectId } = req.params
        const result = await services.cell.getList(projectId)
        res.send(result)
      }),
      update: controllerFactory.make(async (req, res) => {
        const { projectId } = req.params
        const { label, description } = req.body
        const result = await services.project.update({ projectId, label, description })
        res.send(result)
      }),
      delete: controllerFactory.make(async (req, res) => {
        const { projectId } = req.params
        const result = await services.project.delete(projectId)
        res.send(result)
      })
    }
  }
}
