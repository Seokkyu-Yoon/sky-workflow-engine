import { logger } from '../../module/index.js'

const STATUS_READY = 0
const STATUS_RUNNING = 1
const STATUS_FINISHED = 2
const STATUS_STOPPED = 3
const STATUS_ERROR = 4
function getStatusName (code) {
  switch (code) {
    case STATUS_READY: return 'ready'
    case STATUS_RUNNING: return 'running'
    case STATUS_FINISHED: return 'finished'
    case STATUS_STOPPED: return 'stopped'
    case STATUS_ERROR: return 'error'
    default: return 'unknown'
  }
}

export function Runner (dataAccess, { nodes, links }) {
  let status = STATUS_READY
  const errors = []
  const nodeMap = new Map(nodes.map(nodeInfo => [nodeInfo.id, Node(nodeInfo)]))
  links.forEach(({
    src: { node: srcNodeId, port: srcPortId },
    tar: { node: tarNodeId, port: tarPortId }
  }) => {
    const srcNode = nodeMap.get(srcNodeId) || {
      id: srcNodeId,
      status: () => STATUS_FINISHED
    }
    const tarNode = nodeMap.get(tarNodeId) || {
      id: tarNodeId,
      status: () => STATUS_FINISHED
    }
    tarNode.addPrevious(srcNode, srcPortId, tarPortId)
  })

  const runner = {
    run: () => {
      status = STATUS_RUNNING
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
        if (node.status() !== STATUS_FINISHED) {
          status = STATUS_ERROR
          return
        }
      }
      status = STATUS_FINISHED
    },
    status: () => getStatusName(status),
    get: () => ({
      engine: getStatusName(status),
      // fromEntries: [['a', 10], ['b', 20]] -> {a: 10, b: 20}
      nodes: Object.fromEntries(
        [...nodeMap].map(([id, node]) => [
          id,
          getStatusName(node.status())
        ])
      ),
      ...(status === STATUS_ERROR && { errors }) // on error add errors
    })
  }
  return runner
}

function Node ({ id, algorithmId, inPorts, outPorts, parameters }) {
  let status = STATUS_READY
  const preNodes = new Set()
  const inPortMap = new Map()

  return {
    status: () => status,
    run: (onFinish) => {
      status = STATUS_RUNNING
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
        status = Math.random() > 0.1 ? STATUS_FINISHED : STATUS_ERROR
        if (status === STATUS_ERROR) err = new Error('random value lose than 0.3')
        onFinish(err)
        logger.debug(`* node(${id}) ${status}`)
      }, ms)
    },
    isRunning: () => status === STATUS_RUNNING,
    isRunnable: () => {
      if (status !== STATUS_READY) return false
      for (const preNode of preNodes.values()) {
        if (preNode.status() !== STATUS_FINISHED) return false
      }
      return true
    },
    addPrevious: (preNode, preNodeOutPort, myInPort) => {
      preNodes.add(preNode)
      inPortMap.set(myInPort, preNode.id, preNodeOutPort)
    }
  }
}
