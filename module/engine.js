import { LoadMap } from './engine/loadmap.js'

export function Engine (req, res) {
  const spec = req.body
  const cells = spec?.cells || []
  const links = spec?.links || []
  const loadMap = LoadMap(cells, links)
  loadMap.run(res)
}
