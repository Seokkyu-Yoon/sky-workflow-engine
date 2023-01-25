import * as status from './status.js'
import { NodeFactory } from './node.js'

export function RunnerDispenser (storageService, database) {
  const nodeFactory = NodeFactory(database)
  return ({ projectId, workflowId, nodes, links }) => {
    let engineStatus = status.READY
    const errors = []
    const nodeMap = new Map(nodes.map(nodeInfo => [nodeInfo.id, nodeFactory.Node({ ...nodeInfo, projectId, workflowId })]))
    links.forEach(({
      src: { node: srcNodeId, port: srcPortId },
      tar: { node: tarNodeId, port: tarPortId }
    }) => {
      const tarNode = nodeMap.get(tarNodeId)
      if (!tarNode) return

      const srcNode = nodeMap.get(srcNodeId) || nodeFactory.VirtualNode(srcNodeId)
      tarNode.addPrevious(srcNode, srcPortId, tarPortId)
    })

    const readyDir = (async () => {
      const dirpath = storageService.getWorkflowDirpath(projectId, workflowId)
      await storageService.mkDir(dirpath)
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
          node.run().catch(err => errors.push(err?.message)).finally(() => runner.run(errors))
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
}
