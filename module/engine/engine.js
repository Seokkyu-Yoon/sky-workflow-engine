import { LoadMap } from './loadmap.js'

export function Engine (req, res) {
  const spec = req.body
  const nodes = spec?.nodes || []
  const links = spec?.links || []
  const loadMap = LoadMap(nodes, links)

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
    res.status(200).send({ nodeId: '*', message: 'finished' })
  }

  return {
    run
  }
}
