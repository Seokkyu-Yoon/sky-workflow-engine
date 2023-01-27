import { ConnectionMap } from './connection-map.js'
import { MapManager } from './map-manager.js'
import { RunnableNode } from './runnable-node.js'

import * as status from './status.js'

export function Service (algorithmService, fileService, storageService, workflowService) {
  const makeRunnableNodeInfoMaker = RunnableNode.InfoMakerFactory(algorithmService, fileService, storageService)
  const mapManager = MapManager()
  const service = {
    run,
    stop,
    getStatus,
    get
  }
  async function makeEnv (workflowId) {
    const storagePath = storageService.path
    const workflow = await workflowService.get(workflowId)
    const projectId = workflow.projectId

    const env = { projectId, workflowId, storagePath }
    return env
  }
  async function makeDir ({ projectId, workflowId }) {
    const dirpath = storageService.getWorkflowDirpath(projectId, workflowId)
    await storageService.mkDir(dirpath)
  }
  async function run (spec) {
    const {
      workflowId = null,
      nodes = [],
      links = []
    } = spec

    mapManager.checkRunnable(workflowId)
    const env = await makeEnv(workflowId)
    const connectionMap = ConnectionMap(nodes, links)
    const makeRunnableNodeInfo = makeRunnableNodeInfoMaker(env, connectionMap)
    const runnableNodeInfos = await Promise.all(nodes.map(makeRunnableNodeInfo))
    const engine = Engine(runnableNodeInfos, connectionMap)
    const engineId = mapManager.registEngine(workflowId, engine)
    await makeDir(env)
    engine.run()
    return engineId
  }
  async function stop (engineId) {
    const engine = mapManager.getEngine(engineId)
    if (engine === null) throw new Error('engine is not exists')
    if (!engine.isRunning()) throw new Error('engine is not running now')
    await engine.stop()
    return engine.getStatus(true)
  }
  function getStatus (engineId) {
    const engine = mapManager.getEngine(engineId)
    if (engine === null) throw new Error('engine is not exists')
    return engine.getStatus(true)
  }
  function get (workflowId) {
    return mapManager.getEngineId(workflowId)
  }
  return service
}

function Engine (runnableNodeInfos, connectionMap) {
  let engineStatus = status.READY
  const errors = []
  const runnableNodeMap = runnableNodeInfos.reduce((map, runnableNodeInfo) => {
    const runnableNode = RunnableNode(runnableNodeInfo)
    map.set(runnableNode.id, runnableNode)
    return map
  }, new Map())

  const engine = {
    isRunning,
    run,
    stop,
    getStatus
  }
  function isRunning () {
    return engineStatus === status.RUNNING
  }
  async function execRunnableNode (nodeId) {
    const runnableNode = runnableNodeMap.get(nodeId)
    if (runnableNode.getStatus() !== status.READY) return
    const { prevNodeIds = new Set(), nextNodeIds = new Set() } = connectionMap.get(nodeId)
    if (Array.from(prevNodeIds).map(prevNodeId => runnableNodeMap.get(prevNodeId)).some(prevRunnableNode => prevRunnableNode.getStatus() !== status.FINISHED)) return
    await runnableNode.run()
    return await Promise.all(Array.from(nextNodeIds).map(nextNodeId => execRunnableNode(nextNodeId)))
  }
  async function run () {
    engineStatus = status.RUNNING
    await Promise.all(Array.from(runnableNodeMap.keys()).map(nodeId => execRunnableNode(nodeId).catch(err => {
      errors.push(err?.message || '')
    })))

    if (engineStatus === status.STOPPED) return
    if (Array.from(runnableNodeMap.values()).some(node => node.getStatus() !== status.FINISHED)) {
      engineStatus = status.ERROR
    } else {
      engineStatus = status.FINISHED
    }
  }
  async function stop () {
    if (engineStatus !== status.RUNNING) throw new Error('engine is not running')
    await Promise.all(Array.from(runnableNodeMap.values()).map(node => node.stop()))
    engineStatus = status.STOPPED
  }
  function getStatus (showOptionals = false) {
    const engine = engineStatus.description
    if (!showOptionals) return engine

    const nodes = Array.from(runnableNodeMap).reduce((bucket, [nodeId, node]) => {
      bucket[nodeId] = node.getStatus().description
      return bucket
    }, {})
    return {
      engine,
      nodes,
      ...(engineStatus === status.ERROR && { errors })
    }
  }
  return engine
}
