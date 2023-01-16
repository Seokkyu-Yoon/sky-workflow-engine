import { rm } from 'node:fs'
import { resolve } from 'node:path'

import { Workflow } from '../model/index.js'

function getDirPath ({ id: workflowId = null, projectId = null }) {
  const storagePath = process.env.WORKFLOW_STORAGE || './workflow-storage'
  if (projectId === null) throw new Error('projectId is not found')
  if (workflowId === null) throw new Error('workflowId is not found')
  return resolve(storagePath, projectId, workflowId)
}
function rmDir (dirpath) {
  return new Promise((resolve, reject) => {
    rm(dirpath, { recursive: true, force: true }, err => err ? reject(err) : resolve())
  })
}

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
      const workflowInfo = await cursor.workflow.get(id)
      const workflow = Workflow(workflowInfo)

      const dirpath = getDirPath(workflow)
      await rmDir(dirpath)
      const deleted = await cursor.workflow.delete(id)

      return deleted
    }
  }
}
