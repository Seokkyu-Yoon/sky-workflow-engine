import { Workflow } from '../model/index.js'

export function Service (dataAccess) {
  return {
    add: async (workflowInfo) => {
      const workflow = Workflow(workflowInfo)
      await dataAccess.workflow.add(workflow)
      return workflow
    },
    getList: async (projectId = null) => {
      const workflowInfos = await dataAccess.workflow.getList(projectId)
      const workflows = workflowInfos.map(Workflow)
      return workflows
    },
    get: async (id = null) => {
      const workflowInfo = await dataAccess.workflow.get(id)
      const workflow = Workflow(workflowInfo)
      return workflow
    },
    getUi: async (id = null) => {
      const workflowInfo = await dataAccess.workflow.get(id)
      const workflow = Workflow(workflowInfo)
      return workflow.uiSchema
    },
    update: async ({ id = null, ...data }) => {
      const workflowInfo = await dataAccess.workflow.get(id)
      const workflow = Workflow(workflowInfo)
      for (const key of Object.keys(workflow)) {
        if (typeof data[key] !== 'undefined') workflow[key] = data[key]
      }
      const workflowInfoUpdated = await dataAccess.workflow.update(workflow)
      const workflowUpdated = Workflow(workflowInfoUpdated)
      return workflowUpdated
    },
    delete: async (id) => {
      const deleted = await dataAccess.workflow.delete(id)
      return deleted
    }
  }
}
