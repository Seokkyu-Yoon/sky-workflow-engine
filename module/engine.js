import { logger } from './logger.js'

function makeProcess (spec) {
  let timeout = null
  let interval = null
  function run (onData = (e) => {}) {
    const minMs = 3000
    const maxMs = 10000
    timeout = setTimeout(() => {
      clearInterval(interval)
      onData({
        status: 'finished',
        data: 'finish test'
      })
    }, Math.floor(Math.random() * (maxMs - minMs)) + minMs)

    interval = setInterval(() => {
      if (Math.random() < 0.001) {
        onData({
          status: 'errored',
          data: new Error('onError test')
        })
        clearInterval(interval)
        clearTimeout(timeout)
        return
      }
      onData({
        status: 'running',
        data: 'data test'
      })
    }, 100)
  }
  function stop () {
    clearTimeout(timeout)
    clearInterval(interval)
  }

  return {
    run,
    stop
  }
}

function Process (spec) {
  let status = 'ready'
  const process = makeProcess(spec)

  function run (onData = (e) => {}) {
    if (status === 'running') {
      onData({
        status: 'errored',
        data: new Error('already running')
      })
      return
    }
    status = 'running'
    process.run(onData)
  }

  function stop () {
    status = 'ready'
    process.stop()
  }
  return {
    getStatus: () => status,
    run,
    stop
  }
}

function Piece (spec) {
  const process = Process(spec)
  const sources = new Set()
  const targets = new Set()

  const addSource = (source) => sources.add(source)
  const addTarget = (target) => targets.add(target)
  const isRunnable = () => {
    for (const source of sources.values()) {
      if (source.runner.status !== 'finished') return false
    }
    return true
  }

  return {
    process,
    addSource,
    addTarget,
    isRunnable,
    run: process.run
  }
}

function LoadMap (cells, links) {
  const { cellIds, map } = cells.reduce(({ cellIds, map }, { id, ...spec }) => {
    cellIds.push(id)
    map.set(id, Piece(spec))
    return { cellIds, map }
  }, { cellIds: [], map: new Map() })

  links.forEach(({ sourceId, targetId }) => {
    const source = map.get(sourceId)
    const target = map.get(targetId)
    target.addSource(source)
    source.addTarget(target)
  })

  const getRunnablePieces = () => cellIds.reduce((bucket, id) => {
    const piece = map.get(id)
    const runnable = piece.isRunnable()
    runnable && bucket.push(piece)
    return bucket
  }, [])
  return {
    map,
    getRunnablePieces
  }
}

export function Engine (spec) {
  const cells = spec?.cells || {}
  const links = spec?.links || []
  const loadMap = LoadMap(cells, links)
  const mic = { notify: logger.debug }

  ;(function run (mic) {
    loadMap.getRunnablePieces().forEach(id => {
      loadMap.map.get(id).run(e => {
        mic.notify(e)
        if (e.type === 'finished') return run(mic)
      })
    })
  })(mic)
}
