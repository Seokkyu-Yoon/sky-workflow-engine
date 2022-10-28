import { HttpResponse } from './httpResponse.js'

/**
 * @param {import('../service/index.js').serviceProject} serviceProject
 * @param {import('../service/index.js').serviceWorkflow} serviceWorkflow
 */
export function Controller (serviceProject, serviceWorkflow) {
  return {
    add: (req, res, next) => {
      const { label, description } = req.body
      const httpResponse = HttpResponse(res, next)
      httpResponse.send(() => serviceProject.add({ label, description }))
    },
    getList: (req, res, next) => {
      const httpResponse = HttpResponse(res, next)
      httpResponse.send(() => serviceProject.getList())
    },
    get: (req, res, next) => {
      const { projectId } = req.params
      const httpResponse = HttpResponse(res, next)
      httpResponse.send(() => serviceProject.get(projectId))
    },
    getWorkflows: (req, res, next) => {
      const { projectId } = req.params
      const httpResponse = HttpResponse(res, next)
      httpResponse.send(() => serviceWorkflow.getList(projectId))
    },
    update: (req, res, next) => {
      const { projectId } = req.params
      const { label, description } = req.body
      const httpResponse = HttpResponse(res, next)
      httpResponse.send(() => serviceProject.update({ projectId, label, description }))
    },
    delete: (req, res, next) => {
      const { projectId } = req.params
      const httpReponse = HttpResponse(res, next)
      httpReponse.send(() => serviceProject.delete(projectId))
    }
  }
}
