import { service as storageService } from './storage.js'
import { Workflow } from '../model/index.js'

export function Service (database) {
  return {
    add: async (workflowInfo) => {
      const dbConnection = await database.connect()
      const workflow = Workflow(workflowInfo)
      await dbConnection.workflow.add(workflow)
      return workflow
    },
    getList: async (projectId = null) => {
      const dbConnection = await database.connect()
      const workflowInfos = await dbConnection.workflow.getList(projectId)
      const workflows = workflowInfos.map(Workflow)
      return workflows
    },
    get: async (id = null) => {
      const dbConnection = await database.connect()
      const workflowInfo = await dbConnection.workflow.get(id)
      const workflow = Workflow(workflowInfo)
      return workflow
    },
    getUi: async (id = null) => {
      const dbConnection = await database.connect()
      const workflowInfo = await dbConnection.workflow.get(id)
      const workflow = Workflow(workflowInfo)
      return workflow.uiSchema
    },
    update: async ({ id = null, ...data }) => {
      const dbConnection = await database.connect()
      const workflowInfo = await dbConnection.workflow.get(id)
      const workflow = Workflow(workflowInfo)
      for (const key of Object.keys(workflow)) {
        if (typeof data[key] !== 'undefined') workflow[key] = data[key]
      }
      const workflowInfoUpdated = await dbConnection.workflow.update(workflow)
      const workflowUpdated = Workflow(workflowInfoUpdated)
      return workflowUpdated
    },
    delete: async (id) => {
      const dbConnection = await database.connect()
      const workflowInfo = await dbConnection.workflow.get(id)
      const workflow = Workflow(workflowInfo)

      const dirpath = storageService.getWorkflowDirpath(workflow.projectId, workflow.id)
      await storageService.rmDir(dirpath)

      const deleted = await dbConnection.workflow.delete(id)
      return deleted
    },
    getOutput: async (id, nodeId, portId, start = 0, limit = 10) => {
      const dbConnection = await database.connect()
      const workflowInfo = await dbConnection.workflow.get(id)
      const workflow = Workflow(workflowInfo)

      const output = await storageService.getNodeOutput(workflow.projectId, workflow.id, {
        nodeId,
        portId,
        start: Number(start),
        limit: Number(limit)
      })
      return output
    }
  }
}
