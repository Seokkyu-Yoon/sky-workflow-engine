import { Wrapper } from './wrapper.js'

/**
 * @param {import('../service/index.js').serviceProject} serviceProject
 * @param {import('../service/index.js').serviceWorkflow} serviceWorkflow
 */
export function Controller (serviceProject, serviceWorkflow) {
  return {
    add: Wrapper((req) => {
      const { label, description } = req.body
      return serviceProject.add({ label, description })
    }),
    getList: Wrapper((req) => {
      return serviceProject.getList()
    }),
    get: Wrapper((req) => {
      const { projectId } = req.params
      return serviceProject.get(projectId)
    }),
    getWorkflows: Wrapper((req) => {
      const { projectId } = req.params
      return serviceWorkflow.getList(projectId)
    }),
    update: Wrapper((req) => {
      const { projectId } = req.params
      const { label, description } = req.body
      return serviceProject.update({ projectId, label, description })
    }),
    delete: Wrapper((req) => {
      const { projectId } = req.params
      return serviceProject.delete(projectId)
    })
  }
}
