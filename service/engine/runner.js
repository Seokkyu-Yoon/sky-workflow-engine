import { mkdir } from 'node:fs'
import { resolve } from 'node:path'

import * as status from './status.js'
import { Node, VirtualNode } from './node.js'

function getDirPath ({ projectId = null, workflowId = null }) {
  const storagePath = process.env.WORKFLOW_STORAGE || './workflow-storage'
  if (projectId === null) return resolve(storagePath, 'public', 'file')
  if (workflowId === null) return resolve(storagePath, projectId, 'public', 'file')
  return resolve(storagePath, projectId, workflowId)
}
function makeDir (dirpath) {
  return new Promise((resolve, reject) => {
    mkdir(dirpath, { recursive: true }, err => err ? reject(err) : resolve())
  })
}

export function Runner (dataAccess, { projectId, workflowId, nodes, links }) {
  let engineStatus = status.READY
  const errors = []
  const nodeMap = new Map(nodes.map(nodeInfo => [nodeInfo.id, Node({ ...nodeInfo, projectId, workflowId })]))
  links.forEach(({
    src: { node: srcNodeId, port: srcPortId },
    tar: { node: tarNodeId, port: tarPortId }
  }) => {
    const tarNode = nodeMap.get(tarNodeId)
    if (!tarNode) return

    const srcNode = nodeMap.get(srcNodeId) || VirtualNode(srcNodeId)
    tarNode.addPrevious(srcNode, srcPortId, tarPortId)
  })

  const readyDir = (async () => {
    const dirpath = getDirPath({ projectId, workflowId })
    await makeDir(dirpath)
  })()

  const runner = {
    run: async () => {
      engineStatus = status.RUNNING
      let isDone = true
      await readyDir

      for (const node of nodeMap.values()) {
        isDone = isDone && !node.isRunning()
        if (!node.isRunnable()) continue
        isDone = false
        node.run(dataAccess).catch(err => errors.push(err?.message)).finally(() => runner.run(errors))
      }

      if (!isDone) return

      let newStatus = status.FINISHED
      for (const node of nodeMap.values()) {
        const nodeStatus = node.status()
        if (nodeStatus === status.FINISHED) continue
        if (nodeStatus === status.STOPPED) {
          newStatus = status.STOPPED
          break
        }
        newStatus = status.ERROR
      }
      engineStatus = newStatus
    },
    stop: async () => {
      for (const node of nodeMap.values()) {
        await node.stop()
      }
      engineStatus = status.STOPPED
    },
    status: (showOptionals = false) => {
      const engine = status.getName(engineStatus)
      if (!showOptionals) return engine

      const nodes = Object.fromEntries(
        [...nodeMap].map(([id, node]) => [
          id,
          status.getName(node.status())
        ])
      )

      return {
        engine,
        nodes,
        ...(engineStatus === status.ERROR && { errors })
      }
    },
    isRunning () {
      return engineStatus === status.RUNNING
    }
  }
  return runner
}
