import { v4 as uuidv4 } from 'uuid'

export function MapManager () {
  const idMap = new Map()
  const engineMap = new Map()

  function checkRunnable (workflowId) {
    if (workflowId === null) throw new Error('workflowId is not defined')
    if (!idMap.has(workflowId)) return

    const engineId = idMap.get(workflowId) || null
    const engine = engineMap.get(engineId) || null
    if (engine === null) return
    if (engine.isRunning()) throw new Error(`engine already running (${engineId})`) // 엔진 실행 중
  }
  function registEngine (workflowId, engine) {
    const engineId = uuidv4()
    idMap.set(workflowId, engineId)
    engineMap.set(engineId, engine)
    return engineId
  }
  function getEngineId (workflowId) {
    return idMap.get(workflowId) || null
  }
  function getEngine (engineId) {
    return engineMap.get(engineId) || null
  }

  const idManager = {
    checkRunnable,
    registEngine,
    getEngineId,
    getEngine
  }
  return idManager
}
