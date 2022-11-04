export function Controller (controllerFactory) {
  return (service) => {
    return {
      add: controllerFactory.make(async (req, res) => {
        const { id, name, description } = req.body
        const result = await service.project.add({ id, name, description })
        res.send(result)
      }),
      getList: controllerFactory.make(async (req, res) => {
        const result = await service.project.getList()
        res.send(result)
      }),
      get: controllerFactory.make(async (req, res) => {
        const { id } = req.params
        const result = await service.project.get(id)
        res.send(result)
      }),
      getWorkflows: controllerFactory.make(async (req, res) => {
        const { id } = req.params
        const result = await service.workflow.getList(id)
        res.send(result)
      }),
      getCells: controllerFactory.make(async (req, res) => {
        const { id } = req.params
        const result = await service.cell.getList(id)
        res.send(result)
      }),
      update: controllerFactory.make(async (req, res) => {
        const { id } = req.params
        const { name, description } = req.body
        const result = await service.project.update({ id, name, description })
        res.send(result)
      }),
      delete: controllerFactory.make(async (req, res) => {
        const { id } = req.params
        const result = await service.project.delete(id)
        res.send(result)
      })
    }
  }
}
