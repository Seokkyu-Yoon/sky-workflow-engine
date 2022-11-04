import { Workflow } from '../model/index.js'

/**
 * @param {{connect: () => Promise<Cursor>}} dataAccess
 */
export function Service (dataAccess) {
  return {
    add: async (workflowInfo) => {
      const cursor = await dataAccess.connect()
      const workflow = Workflow(workflowInfo)
      await cursor.workflow.add(workflow)
      return workflow
    },
    getList: async (projectId = null) => {
      const cursor = await dataAccess.connect()
      const workflowInfos = await cursor.workflow.getList(projectId)
      const workflows = workflowInfos.map(Workflow)
      return workflows
    },
    get: async (id = null) => {
      const cursor = await dataAccess.connect()
      const workflowInfo = await cursor.workflow.get(id)
      const workflow = Workflow(workflowInfo)
      return workflow
    },
    getUi: async (id = null) => {
      const cursor = await dataAccess.connect()
      const workflowInfo = await cursor.workflow.get(id)
      const workflow = Workflow(workflowInfo)
      return workflow.uiSchema
    },
    update: async ({ id = null, ...data }) => {
      const cursor = await dataAccess.connect()
      const workflowInfo = await cursor.workflow.get(id)
      const workflow = Workflow(workflowInfo)
      for (const key of Object.keys(workflow)) {
        if (typeof data[key] !== 'undefined') workflow[key] = data[key]
      }
      const workflowInfoUpdated = await cursor.workflow.update(workflow)
      const workflowUpdated = Workflow(workflowInfoUpdated)
      return workflowUpdated
    },
    delete: async (id) => {
      const cursor = await dataAccess.connect()
      const deleted = await cursor.workflow.delete(id)
      return deleted
    }
  }
}
