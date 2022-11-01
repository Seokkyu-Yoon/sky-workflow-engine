export function Controller (controllerFactory) {
  return (services) => {
    return {
      add: controllerFactory.make(async (req, res) => {
        const { id, name, description } = req.body
        const result = await services.project.add({ id, name, description })
        res.send(result)
      }),
      getList: controllerFactory.make(async (req, res) => {
        const result = await services.project.getList()
        res.send(result)
      }),
      get: controllerFactory.make(async (req, res) => {
        const { id } = req.params
        const result = await services.project.get(id)
        res.send(result)
      }),
      getWorkflows: controllerFactory.make(async (req, res) => {
        const { id } = req.params
        const result = await services.workflow.getList(id)
        res.send(result)
      }),
      getCells: controllerFactory.make(async (req, res) => {
        const { id } = req.params
        const result = await services.cell.getList(id)
        res.send(result)
      }),
      update: controllerFactory.make(async (req, res) => {
        const { id } = req.params
        const { name, description } = req.body
        const result = await services.project.update({ id, name, description })
        res.send(result)
      }),
      delete: controllerFactory.make(async (req, res) => {
        const { id } = req.params
        const result = await services.project.delete(id)
        res.send(result)
      })
    }
  }
}
