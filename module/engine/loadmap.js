import { Piece } from './piece.js'

export function LoadMap (nodes, links) {
  const map = nodes.reduce((map, spec) => {
    const { id } = spec
    map.set(id, Piece(spec))
    return map
  }, new Map())

  links.forEach(({ sourceId, targetId }) => {
    const source = map.get(sourceId)
    const target = map.get(targetId)
    target.addSource(source)
    source.addTarget(target)
  })

  function run (res, errors = []) {
    let isDone = true
    for (const piece of map.values()) {
      isDone = isDone && !piece.isRunning()
      if (!piece.isRunnable()) continue
      isDone = false
      piece.run(e => {
        const errored = e.status === 'errored'
        const running = e.status === 'running'
        if (errored) errors.push(e.body)
        res.status(errored ? 500 : 200).notify(e.body)
        if (running) return
        run(res, errors)
      })
    }

    if (!isDone) return
    if (errors.length > 0) {
      res.status(500).send(errors)
      return
    }
    res.status(200).send({ nodeId: '*', message: 'finished' })
  }
  return {
    map,
    run
  }
}
