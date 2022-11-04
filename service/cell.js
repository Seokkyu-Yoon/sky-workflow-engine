import { Cell } from '../model/index.js'

export function Service (dataAccess) {
  return {
    add: async (cellInfo) => {
      const cell = Cell(cellInfo)
      await dataAccess.cell.add(cell)
      return cell
    },
    getList: async (projectId = null) => {
      const cellInfos = await dataAccess.cell.getList(projectId)
      const cells = cellInfos.map(Cell)
      return cells
    },
    get: async (id = null) => {
      const cellInfo = await dataAccess.cell.get(id)
      const cell = Cell(cellInfo)
      return cell
    },
    update: async ({ id = null, ...data }) => {
      const cellInfo = await dataAccess.cell.get(id)
      const cell = Cell(cellInfo)
      for (const key of Object.keys(cell)) {
        if (typeof data[key] !== 'undefined') cell[key] = data[key]
      }
      const cellInfoUpdated = await dataAccess.cell.update(cell)
      const cellUpdated = Cell(cellInfoUpdated)
      return cellUpdated
    },
    delete: async (id = null) => {
      const deleted = await dataAccess.cell.delete(id)
      return deleted
    }
  }
}
