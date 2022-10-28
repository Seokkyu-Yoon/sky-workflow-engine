import { Wrapper } from './wrapper.js'

export function Controller (serviceWorkflow) {
  return {
    add: Wrapper((req) => {
      const { projectId, label, description, uiSchema } = req.body
      return serviceWorkflow.add({ projectId, label, description, uiSchema })
    }),
    getList: Wrapper((req) => {
      const { projectId = null } = req.params
      return serviceWorkflow.getList(projectId)
    }),
    get: Wrapper((req) => {
      const { workflowId } = req.params
      return serviceWorkflow.get(workflowId)
    }),
    getUi: Wrapper((req) => {
      const { workflowId } = req.params
      return serviceWorkflow.get(workflowId)
    }),
    update: Wrapper((req) => {
      const { workflowId } = req.params
      const { projectId, label, description, uiSchema } = req.body
      return serviceWorkflow.update({ projectId, workflowId, label, description, uiSchema })
    }),
    delete: Wrapper((req) => {
      const { workflowId } = req.params
      return serviceWorkflow.delete(workflowId)
    })
  }
}
