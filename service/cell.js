import { ModelCell } from '../model/index.js'

export function Service (dataAccess) {
  return {
    add: async (cellInfo) => {
      const cell = ModelCell(cellInfo)
      await dataAccess.cells.add(cell)
      return cell
    },
    getList: async (projectId = null) => {
      const cellInfos = await dataAccess.cells.getList(projectId)
      const cells = cellInfos.map(ModelCell)
      return cells
    },
    get: async (cellId = null) => {
      const cellInfo = await dataAccess.cells.get(cellId)
      const cell = ModelCell(cellInfo)
      return cell
    },
    update: async ({ cellId = null, ...data }) => {
      const cellInfo = await dataAccess.cells.get(cellId)
      const cell = ModelCell(cellInfo)
      for (const key of Object.keys(cell)) {
        if (typeof data[key] !== 'undefined') cell[key] = data[key]
      }
      const cellInfoUpdated = await dataAccess.cells.update(cell)
      const cellUpdated = ModelCell(cellInfoUpdated)
      return cellUpdated
    },
    delete: async (cellId = null) => {
      const deleted = await dataAccess.cells.delete(cellId)
      return deleted
    }
  }
}