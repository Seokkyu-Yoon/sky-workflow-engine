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
    get: async (id = null) => {
      const cellInfo = await dataAccess.cells.get(id)
      const cell = ModelCell(cellInfo)
      return cell
    },
    update: async ({ id = null, ...data }) => {
      const cellInfo = await dataAccess.cells.get(id)
      const cell = ModelCell(cellInfo)
      for (const key of Object.keys(cell)) {
        if (typeof data[key] !== 'undefined') cell[key] = data[key]
      }
      const cellInfoUpdated = await dataAccess.cells.update(cell)
      const cellUpdated = ModelCell(cellInfoUpdated)
      return cellUpdated
    },
    delete: async (id = null) => {
      const deleted = await dataAccess.cells.delete(id)
      return deleted
    }
  }
}
