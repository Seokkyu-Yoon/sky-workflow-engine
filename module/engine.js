function Runner (spec) {
  let status = 'ready'
  let process = null

  return {
    status,
    run: () => {
      if (status === 'running') throw new Error('already running')
      status = 'running'
      try {
        process = () => {}
        // [TODO]
        status = 'finished'
      } catch (e) {
        status = 'errored'
        throw e
      }
    },
    stop: () => {
      if (status !== 'running') return
      status = 'ready'
      process = null
    }
  }
}

function Piece (spec) {
  const runner = Runner(spec)
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
    runner,
    addSource,
    addTarget,
    isRunnable,
    run: runner.run
  }
}

function LoadMap (cells, links) {
  const cellIds = Object.keys(cells)
  const map = new Map()
  cellIds.forEach((cellId) => map.set(cellId, Piece()))

  links.forEach(({ sourceId, targetId }) => {
    const source = map.get(sourceId)
    const target = map.get(targetId)
    target.addSource(source)
    source.addTarget(target)
  })

  const getRunnableIds = () => cellIds.reduce((bucket, cellId) => {
    const piece = map.get(cellId)
    const runnable = piece.isRunnable()
    runnable && bucket.push(piece)
    return bucket
  }, [])
  return {
    map,
    getRunnableIds
  }
}

export function Engine (spec) {
  const runners = new Map()
  const cells = spec?.cells || {}
  const links = spec?.links || []
  const loadMap = LoadMap(cells, links)
}
