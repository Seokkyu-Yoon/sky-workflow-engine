import { Cell } from '../model/index.js'

/**
 * @param {{connect: () => Promise<Cursor>}} dataAccess
 */
export function Service (dataAccess) {
  return {
    add: async (cellInfo) => {
      const cell = Cell(cellInfo)
      const cursor = await dataAccess.connect()
      await cursor.cell.add(cell)
      return cell
    },
    getList: async (projectId = null) => {
      const cursor = await dataAccess.connect()
      console.log(cursor)
      const cellInfos = await cursor.cell.getList(projectId)
      const cells = cellInfos.map(Cell)
      return cells
    },
    get: async (id = null) => {
      const cursor = await dataAccess.connect()
      const cellInfo = await cursor.cell.get(id)
      const cell = Cell(cellInfo)
      return cell
    },
    update: async ({ id = null, ...data }) => {
      const cursor = await dataAccess.connect()
      const cellInfo = await cursor.cell.get(id)
      const cell = Cell(cellInfo)
      for (const key of Object.keys(cell)) {
        if (typeof data[key] !== 'undefined') cell[key] = data[key]
      }
      const cellInfoUpdated = await dataAccess.cell.update(cell)
      const cellUpdated = Cell(cellInfoUpdated)
      return cellUpdated
    },
    delete: async (id = null) => {
      const cursor = await dataAccess.connect()
      const deleted = await cursor.cell.delete(id)
      return deleted
    }
  }
}
