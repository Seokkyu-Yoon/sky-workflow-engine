import { logger } from '../../module/index.js'

import * as status from './status.js'
import { Node, VirtualNode } from './node.js'

export function Runner (dataAccess, { nodes, links }) {
  let engineStatus = status.READY
  const errors = []
  const nodeMap = new Map(nodes.map(nodeInfo => [nodeInfo.id, Node(nodeInfo)]))
  links.forEach(({
    src: { node: srcNodeId, port: srcPortId },
    tar: { node: tarNodeId, port: tarPortId }
  }) => {
    const tarNode = nodeMap.get(tarNodeId)
    if (!tarNode) return

    const srcNode = nodeMap.get(srcNodeId) || VirtualNode(srcNodeId)
    tarNode.addPrevious(srcNode, srcPortId, tarPortId)
  })

  const runner = {
    run: () => {
      engineStatus = status.RUNNING
      let isDone = true

      for (const node of nodeMap.values()) {
        isDone = isDone && !node.isRunning()
        if (!node.isRunnable()) continue
        isDone = false
        node.run(dataAccess).then(() => runner.run(errors)).catch(err => errors.push(err.message))
      }

      if (!isDone) return

      for (const node of nodeMap.values()) {
        if (node.status() !== status.FINISHED) {
          engineStatus = status.ERROR
          return
        }
      }
      engineStatus = status.FINISHED
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
    }
  }
  return runner
}
