import { logger } from '../../module/index.js'

import * as status from './status.js'
import { ChildProcess } from './child-process.js'

export function Node ({ id, algorithmId, inPorts, outPorts, parameters }) {
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
      // [TODO] read algorithm info
      const cursor = await dataAccess.connect()
      const algorithm = await cursor.algorithm.get(algorithmId)
      // [TODO] spawn algorithm and rebuild spec to run algorithm

      // for test
      const minMs = 5000
      const maxMs = 15000
      const ms = Math.floor(Math.random() * (maxMs - minMs)) + minMs
      const spec = { ms }
      try {
        logger.debug(`* run node[${id}] finish after ${ms}ms`)
        childProcess = ChildProcess.Dummy(spec)
        await childProcess.run()
        nodeStatus = status.FINISHED
      } catch (err) {
        nodeStatus = status.ERROR
        throw err
      } finally {
        logger.debug(`* node[${id}](status: ${status.getName(nodeStatus)})`)
      }
    },
    stop: () => {
      if (nodeStatus !== status.RUNNING) return
      //  [TODO] kill process
      childProcess.stop()
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
