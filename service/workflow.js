import { rm, readFile, createReadStream } from 'node:fs'
import readline from 'node:readline'
import path from 'node:path'

import { Workflow } from '../model/index.js'

function getDirpath ({ id: workflowId = null, projectId = null }) {
  const storagePath = process.env.WORKFLOW_STORAGE || './workflow-storage'
  if (projectId === null) throw new Error('projectId is not found')
  if (workflowId === null) throw new Error('workflowId is not found')
  return path.resolve(storagePath, projectId, workflowId)
}
function rmDir (dirpath) {
  return new Promise((resolve, reject) => {
    rm(dirpath, { recursive: true, force: true }, err => err ? reject(err) : resolve())
  })
}
function getFile (dirpath, nodeId, portId, start, limit) {
  return new Promise((resolve, reject) => {
    let cnt = 0
    const lines = []
    const rl = readline.createInterface({
      input: createReadStream(path.resolve(dirpath, `${nodeId}.${portId}`)),
      crlfDelay: Infinity
    }).on('line', onLine).on('close', onClose)
    function onLine (line) {
      if (cnt >= start) lines.push(line)
      cnt += 1
      if (cnt === limit) {
        rl.off('line', onLine)
        rl.close()
      }
    }
    function onClose () {
      resolve(lines)
    }
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

      const dirpath = getDirpath(workflow)
      await rmDir(dirpath)

      const deleted = await cursor.workflow.delete(id)
      return deleted
    },
    getOutput: async (id, nodeId, portId, start = 0, limit = 10) => {
      const cursor = await dataAccess.connect()
      const workflowInfo = await cursor.workflow.get(id)
      const workflow = Workflow(workflowInfo)

      const dirpath = getDirpath(workflow)
      const output = await getFile(dirpath, nodeId, portId, start, limit)
      return output
    }
  }
}
