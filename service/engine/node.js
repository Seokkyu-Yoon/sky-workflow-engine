import * as status from './status.js'
import { ChildProcess } from './child-process.js'

export function Node ({ id, projectId, workflowId, algorithmId, inPorts, outPorts, params }) {
  let nodeStatus = status.READY
  let childProcess = null
  const preNodes = new Set()
  const inPortMap = new Map()

  return {
    id,
    status: () => nodeStatus,
    run: async (dataAccess) => {
      if (nodeStatus === status.RUNNING) throw new Error('already running')
      nodeStatus = status.RUNNING
      const cursor = await dataAccess.connect()
      const algorithm = await cursor.algorithm.get(algorithmId)

      // [TODO] spawn algorithm and rebuild spec to run algorithm
      const spec = processSpec({ id, projectId, workflowId, algorithm, inPorts, outPorts, params }, inPortMap)

      try {
        childProcess = ChildProcess(algorithm, spec)
        await childProcess.run()
        nodeStatus = status.FINISHED
      } catch (err) {
        if (nodeStatus === status.STOPPED) return
        nodeStatus = status.ERROR
        throw err
      }
    },
    stop: async () => {
      if (nodeStatus !== status.RUNNING) return
      await childProcess.stop()
      nodeStatus = status.STOPPED
    },
    isRunning: () => nodeStatus === status.RUNNING,
    isRunnable: () => {
      if (nodeStatus !== status.READY) return false
      for (const preNode of preNodes.values()) {
        if (preNode.status() !== status.FINISHED) return false
      }
      return true
    },
    addPrevious: (preNode, preNodeOutPort, myInPort) => {
      preNodes.add(preNode)
      inPortMap.set(myInPort, {
        node: preNode.id,
        port: preNodeOutPort
      })
    }
  }
}
export function VirtualNode (id) {
  const nodeStatus = status.FINISHED
  return {
    id,
    status: () => nodeStatus
  }
}

function processSpec ({ id, projectId, workflowId, inPorts, outPorts, params }, inPortMap) {
  const spec = {
    id,
    env: {
      projectId,
      workflowId,
      storagePath: process.env.WORKFLOW_STORAGE
    },
    inputs: inPorts.map(inPortId => {
      const { node, port } = inPortMap.get(inPortId) || {}
      return `${node}.${port}`
    }),
    outputs: outPorts,
    params: params.reduce((bucket, { key, value }) => {
      bucket[key] = value
      return bucket
    }, {})
  }
  return spec
}
function processTestSpec () {
  const minMs = 5000
  const maxMs = 15000
  const ms = Math.floor(Math.random() * (maxMs - minMs)) + minMs
  return { ms }
}
