import { v4 as uuidv4 } from 'uuid'

export function Cell (db = null) {
  if (db === null) throw new Error('db is null')

  db.data.cells = db.data.cells || []

  return {
    add: async ({ cellId = uuidv4(), ...data }) => {
      const cell = { ...data, cellId }
      db.data.cells.push(cell)
      await db.write()
      return cell
    },
    getList: async (projectId = null) => {
      if (projectId === null) return db.data.cells || []
      return (db.data.cells || []).filter(cell => cell.projectId === projectId)
    },
    get: async (cellId = null) => {
      return db.data.cells.find(c => c.cellId === cellId) || null
    },
    update: async (cell) => {
      const cellId = cell?.cellId || null
      if (cellId === null) throw new Error('cellId is not defined')

      const idx = db.data.cells.findIndex(c => c.cellId === cellId)
      if (idx < 0) throw new Error(`${cellId} is not defined cell`)

      db.data.cells.splice(idx, 1, cell)
      await db.write()
      return cell
    },
    delete: async (cellId = null) => {
      if (cellId === null) throw new Error('cellId is not defined')

      const idx = db.data.cells.findIndex((c) => c.cellId === cellId)
      if (idx < 0) return false

      db.data.cells.splice(idx, 1)
      await db.write()
      return true
    }
  }
}
