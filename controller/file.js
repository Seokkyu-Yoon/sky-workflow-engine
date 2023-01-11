import { FormData } from '../module/index.js'

export function Controller (make, service) {
  return {
    add: make(async (req, res) => {
      const body = await FormData(req)
      const result = await service.add(body)
      res.send(result)
    }),
    getList: make(async (req, res) => {
      const { workflowId = null, projectId = null } = req.query
      const result = await service.getList({ workflowId, projectId })
      res.send(result)
    }),
    get: make(async (req, res) => {
      const { id } = req.params
      const result = await service.get(id)
      res.send(result)
    }),
    delete: make(async (req, res) => {
      const { id } = req.params
      const result = await service.delete(id)
      res.send(result)
    })
  }
}
