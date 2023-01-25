import * as status from './status.js'
import { ChildProcess } from './child-process.js'

export function NodeFactory (database) {
  return {
    Node: ({ id, projectId, workflowId, algorithmId, inPorts, outPorts, params }) => {
      let nodeStatus = status.READY
      let childProcess = null
      const preNodes = new Set()
      const inPortMap = new Map()
      const specFactory = SpecFactory(database, inPortMap)

      return {
        id,
        status: () => nodeStatus,
        run: async () => {
          if (nodeStatus === status.RUNNING) throw new Error('already running')
          nodeStatus = status.RUNNING
          const dbConnection = await database.connect()
          const algorithm = await dbConnection.algorithm.get(algorithmId)

          // [TODO] spawn algorithm and rebuild spec to run algorithm
          const spec = specFactory({ id, projectId, workflowId, algorithm, inPorts, outPorts, params }, inPortMap)

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
    },
    VirtualNode: id => {
      const nodeStatus = status.FINISHED
      return {
        id,
        status: () => nodeStatus
      }
    }
  }
}

function SpecFactory (database, inPortMap) {
  return function Spec ({ id, projectId, workflowId, inPorts, outPorts, params }) {
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
      params: params.reduce((bucket, { type, key, value }) => {
        bucket[key] = value
        return bucket
      }, {})
    }
    return spec
  }
}
