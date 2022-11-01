export function Controller (controllerFactory) {
  return (services) => {
    return {
      add: controllerFactory.make(async (req, res) => {
        const { id, projectId, name, description, inputs, outputs, params } = req.body
        const result = await services.cell.add({ id, projectId, name, description, inputs, outputs, params })
        res.send(result)
      }),
      getList: controllerFactory.make(async (req, res) => {
        const result = await services.cell.getList()
        res.send(result)
      }),
      get: controllerFactory.make(async (req, res) => {
        const { id } = req.params
        const result = await services.cell.get(id)
        res.send(result)
      }),
      update: controllerFactory.make(async (req, res) => {
        const { id } = req.params
        const { projectId, name, description, inputs, outputs, params } = req.body
        const result = await services.cell.update({ id, projectId, name, description, inputs, outputs, params })
        res.send(result)
      }),
      delete: controllerFactory.make(async (req, res) => {
        const { id } = req.params
        const result = await services.cell.delete(id)
        res.send(result)
      })
    }
  }
}
