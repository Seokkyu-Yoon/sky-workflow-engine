export function Controller (controllerFactory) {
  return (services) => {
    return {
      add: controllerFactory.make(async (req, res) => {
        const { projectId, label, description, inputs, outputs, params } = req.body
        const result = await services.cell.add({ projectId, label, description, inputs, outputs, params })
        res.send(result)
      }),
      getList: controllerFactory.make(async (req, res) => {
        const { projectId = null } = req.params
        const result = await services.cell.getList(projectId)
        res.send(result)
      }),
      get: controllerFactory.make(async (req, res) => {
        const { cellId } = req.params
        const result = await services.cell.get(cellId)
        res.send(result)
      }),
      update: controllerFactory.make(async (req, res) => {
        const { cellId } = req.params
        const { projectId, label, description, inputs, outputs, params } = req.body
        const result = await services.cell.update({ projectId, cellId, label, description, inputs, outputs, params })
        res.send(result)
      }),
      delete: controllerFactory.make(async (req, res) => {
        const { cellId } = req.params
        const result = await services.cell.delete(cellId)
        res.send(result)
      })
    }
  }
}
