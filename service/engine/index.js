import { Engine } from '../../model/index.js'
import { logger } from '../../module/index.js'
import { Runner } from './runner.js'

export function Service (dataAccess) {
  const workflowEngineMap = new Map()
  const engineMap = new Map()

  const checkRunnable = EngineRunnableChecker(workflowEngineMap, engineMap)
  const createEngine = EngineDispenser(workflowEngineMap, engineMap)

  return {
    run: spec => {
      // logger.debug(spec)
      checkRunnable(spec)
      const engine = createEngine(spec)
      runEngine(dataAccess, engine)
      return engine.id
    },
    // stop: engineId => {
    //   const engine = engineMap.get(engineId) || null
    //   if (engine === null) throw new Error('engine is null')
    //   if (engine.status !== 'running') throw new Error('engine already stopped')
    //   stopEngine(engine)
    // },
    status: engineId => {
      const engine = engineMap.get(engineId) || null
      if (engine === null) throw new Error('engine is not found')
      return engine.runner.get()
    }
  }
}

function EngineRunnableChecker (workflowEngineMap, engineMap) {
  return spec => {
    const workflowId = spec?.workflowId || null
    if (workflowId === null) throw new Error('workflowId is not defined')
    if (!workflowEngineMap.has(workflowId)) return // 해당 워크플로우에 기존 실행된 엔진 없음

    const engineId = workflowEngineMap.get(workflowId)
    const engine = engineMap.get(engineId) || null
    if (engine === null) return // 기존 엔진 정보 확인 불가로 재실행
    if (engine.runner === null) return // 실행 정보 없음
    if (engine.runner.status() === 'running') throw new Error(`engine already running (${engineId})`) // 엔진 실행 중
  }
}
function EngineDispenser (workflowEngineMap, engineMap) {
  return spec => {
    const engine = Engine(spec)
    const id = engine.id
    const workflowId = engine.workflowId
    workflowEngineMap.set(workflowId, id)
    engineMap.set(id, engine)
    return engine
  }
}
async function runEngine (dataAccess, engine) {
  engine.runner = Runner(dataAccess, engine)
  engine.runner.run()
}
