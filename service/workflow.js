import { ModelWorkflow } from '../model/index.js'
import { DataAccess } from '../data-access/index.js'

const dataAccess = await DataAccess()

export const service = {
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
  update: async (workflowInfo) => {
    const workflow = ModelWorkflow(workflowInfo)
    await dataAccess.workflows.update(workflow)
    return workflow
  },
  delete: async (workflowId) => {
    const deleted = await dataAccess.workflows.delete(workflowId)
    return deleted
  }
}
