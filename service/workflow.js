import { ModelWorkflow } from '../model/index.js'

export function Service (dataAccess) {
  return {
    add: async (workflowInfo) => {
      const workflow = ModelWorkflow(workflowInfo)
      await dataAccess.workflows.add(workflow)
      return workflow
    },
    getList: async (projectId = null) => {
      const workflowInfos = await dataAccess.workflows.getList(projectId)
      const workflows = workflowInfos.map(ModelWorkflow)
      return workflows
    },
    get: async (workflowId = null) => {
      const workflowInfo = await dataAccess.workflows.get(workflowId)
      const workflow = ModelWorkflow(workflowInfo)
      return workflow
    },
    getUi: async (workflowId = null) => {
      const workflowInfo = await dataAccess.workflows.get(workflowId)
      const workflow = ModelWorkflow(workflowInfo)
      return workflow.uiSchema
    },
    update: async ({ workflowId = null, ...data }) => {
      const workflowInfo = await dataAccess.workflows.get(workflowId)
      const workflow = ModelWorkflow(workflowInfo)
      for (const key of Object.keys(workflow)) {
        if (typeof data[key] !== 'undefined') workflow[key] = data[key]
      }
      const workflowInfoUpdated = await dataAccess.workflows.update(workflow)
      const workflowUpdated = ModelWorkflow(workflowInfoUpdated)
      return workflowUpdated
    },
    delete: async (workflowId) => {
      const deleted = await dataAccess.workflows.delete(workflowId)
      return deleted
    }
  }
}
