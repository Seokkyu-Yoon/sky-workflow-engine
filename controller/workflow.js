import { HttpResponse } from './httpResponse.js'

export function Controller (serviceWorkflow) {
  return {
    add: (req, res, next) => {
      const httpResponse = HttpResponse(res, next)
      const { projectId, label, description, uiSchema } = req.body
      httpResponse.send(() => serviceWorkflow.add({ projectId, label, description, uiSchema }))
    },
    getList: (req, res, next) => {
      const { projectId = null } = req.params
      const httpResponse = HttpResponse(res, next)
      httpResponse.send(() => serviceWorkflow.getList(projectId))
    },
    get: (req, res, next) => {
      const { workflowId } = req.params
      const httpResponse = HttpResponse(res, next)
      httpResponse.send(() => serviceWorkflow.get(workflowId))
    },
    getUi: (req, res, next) => {
      const { workflowId } = req.params
      const httpResponse = HttpResponse(res, next)
      httpResponse.send(() => serviceWorkflow.get(workflowId))
    },
    update: (req, res, next) => {
      const { workflowId } = req.params
      const { projectId, label, description, uiSchema } = req.body
      const httpResponse = HttpResponse(res, next)
      httpResponse.send(() => serviceWorkflow.update({ projectId, workflowId, label, description, uiSchema }))
    },
    delete: (req, res, next) => {
      const { workflowId } = req.params
      const httpResponse = HttpResponse(res, next)
      httpResponse.send(() => serviceWorkflow.delete(workflowId))
    }
  }
}
