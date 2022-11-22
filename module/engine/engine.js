import { Process } from './process.js'
import { LoadMap } from './loadmap.js'

export function Engine (req, res) {
  const spec = req.body
  const cells = spec?.cells || []
  const links = spec?.links || []
  const loadMap = LoadMap(cells, links)

  function run (errors = []) {
    let isDone = true
    for (const piece of loadMap.map.values()) {
      isDone = isDone && !piece.isRunning()
      if (!piece.isRunnable()) continue
      isDone = false
      piece.run(e => {
        const errored = e.status === 'errored'
        const running = e.status === 'running'
        if (errored) errors.push(e.body)
        res.status(errored ? 500 : 200).notify(e.body)
        if (running) return
        run(errors)
      })
    }
    if (!isDone) return
    if (errors.length > 0) {
      res.status(500).send(errors)
      return
    }
    res.status(200).send({ cellId: '*', message: 'finished' })
  }

  return {
    run
  }
}

export function Engine2 (req, res) {
  const spec = req.body
  const cells = spec?.cells || []
  const links = spec?.links || []
  const processMap = new Map(cells.map((spec) => [spec.id, Process(spec)]))
  const sequenceMap = new Map()
  links.forEach(({ sourceId, targetId }) => {
    const seqSource = sequenceMap.get(sourceId) || new Sequence()
    const seqTarget = sequenceMap.get(targetId) || new Sequence()

    const procSource = processMap.get(sourceId)
    const procTarget = processMap.get(targetId)
    seqSource.addChild(procTarget)
    seqTarget.addParent(procSource)

    sequenceMap.set(sourceId, seqSource)
    sequenceMap.set(targetId, seqTarget)
  })

  const scheduler = Scheduler()
  return {
    run: scheduler.run
    // stop
  }
}

function Sequence () {
  const children = new Set()
  const parents = new Set()
  return {
    addChild: process => children.add(process),
    addParent: process => parents.add(process),
    getChildren: () => [...children],
    getParents: () => [...parents]
  }
}

/**
 * @param {Map} processMap
 * @param {Map} sequenceMap
 */
function Scheduler (processMap, sequenceMap) {
  const cellIds = new Set(processMap.keys())

  function run (cellId = null) {
    return cellId === null ? runAll() : runSingle(cellId)
  }
  function runSingle (cellId) {
    // [TODO] something to run a process
  }
  function runAll () {

  }
  function stop (cellId = null) {
    return cellId === null ? stopAll() : stopSingle(cellId)
  }
  function stopSingle (cellId) {
    // [TODO] something to stop a process
  }
  function stopAll () {
    // [TODO] something to stop all processes
  }

  return { run, stop }
}
