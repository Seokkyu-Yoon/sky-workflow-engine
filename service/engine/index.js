import { logger } from '../../module/index.js'

import { Engine, Workflow } from '../../model/index.js'
import { Runner } from './runner.js'

export function Service (dataAccess) {
  const workflowEngineMap = new Map()
  const engineMap = new Map()

  const checkRunnable = EngineRunnableChecker(workflowEngineMap, engineMap)
  const createEngine = EngineDispenser(workflowEngineMap, engineMap)

  return {
    run: async spec => {
      checkRunnable(spec)
      const cursor = await dataAccess.connect()
      const workflowInfo = await cursor.workflow.get(spec.workflowId)
      const workflow = Workflow(workflowInfo)
      const engine = createEngine({ ...spec, projectId: workflow.projectId })
      runEngine(dataAccess, engine)
      return engine.id
    },
    stop: async engineId => {
      const engine = engineMap.get(engineId) || null
      await stopEngine(engine)
      return engine.runner.status(true)
    },
    status: engineId => {
      const engine = engineMap.get(engineId) || null
      if (engine === null) throw new Error('engine is not found')
      return engine.runner.status(true)
    },
    get: workflowId => {
      return workflowEngineMap.get(workflowId) || null
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
    if (engine.runner.isRunning()) throw new Error(`engine already running (${engineId})`) // 엔진 실행 중
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
function runEngine (dataAccess, engine) {
  engine.runner = Runner(dataAccess, engine)
  engine.runner.run()
}
function stopEngine (engine) {
  if (engine.runner === null) throw new Error('engine does not run anytime')
  if (!engine.runner.isRunning()) throw new Error('engine is not running now')
  return engine.runner.stop()
}
