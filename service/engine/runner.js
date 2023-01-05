import { logger } from '../../module/index.js'

export function Runner (dataAccess, { nodes, links }) {
  let status = 'ready'
  const errors = []
  const nodeMap = new Map(nodes.map(nodeInfo => [nodeInfo.id, Node(nodeInfo)]))
  links.forEach(({
    src: { node: srcNodeId, port: srcPortId },
    tar: { node: tarNodeId, port: tarPortId }
  }) => {
    const srcNode = nodeMap.get(srcNodeId) || {
      id: srcNodeId,
      status: () => 'finished'
    }
    const tarNode = nodeMap.get(tarNodeId) || {
      id: tarNodeId,
      status: () => 'finished'
    }
    tarNode.addPrevious(srcNode, srcPortId, tarPortId)
  })

  const runner = {
    run: () => {
      status = 'running'
      let isDone = true

      for (const node of nodeMap.values()) {
        isDone = isDone && !node.isRunning()
        if (!node.isRunnable()) continue
        isDone = false
        node.run(err => {
          if (err) {
            // console.error(err)
            errors.push(err.message)
          }
          runner.run(errors)
        })
      }

      if (!isDone) return

      for (const node of nodeMap.values()) {
        if (node.status() !== 'finished') {
          status = 'errored'
          return
        }
      }
      status = 'finished'
    },
    status: () => status,
    get: () => {
      const engineStatus = {
        engine: status,
        // fromEntries [['a', 10], ['b', 20]] -> {a: 10, b: 20}
        nodes: Object.fromEntries([...nodeMap].map(([id, node]) => [
          id,
          node.status()
        ]))
      }
      if (status === 'errored') engineStatus.errors = errors
      return engineStatus
    }
  }
  return runner
}
function Node ({ id, algorithmId, inPorts, outPorts, parameters }) {
  let status = 'ready'
  const preNodes = new Set()
  const inPortMap = new Map()

  return {
    status: () => status,
    run: (onFinish) => {
      status = 'running'
      // [TODO] read algorithm info
      // [TODO] spawn algorithm to parsed spec
      // [TODO]

      // for test
      const minMs = 5000
      const maxMs = 15000
      const ms = Math.floor(Math.random() * (maxMs - minMs)) + minMs
      logger.debug(`* run node(${id} / finish after ${ms}ms)`)
      setTimeout(() => {
        let err = null
        status = Math.random() > 0.1 ? 'finished' : 'errored'
        if (status === 'errored') err = new Error('random value lose than 0.3')
        onFinish(err)
        logger.debug(`* node(${id}) ${status}`)
      }, ms)
    },
    isRunning: () => status === 'running',
    isRunnable: () => {
      if (status !== 'ready') return false
      for (const preNode of preNodes.values()) {
        if (preNode.status() !== 'finished') return false
      }
      return true
    },
    addPrevious: (preNode, preNodeOutPort, myInPort) => {
      preNodes.add(preNode)
      inPortMap.set(myInPort, preNode.id, preNodeOutPort)
    }
  }
}
