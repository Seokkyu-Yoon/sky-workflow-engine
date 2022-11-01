import { v4 as uuidv4 } from 'uuid'

export function Cell (db = null) {
  if (db === null) throw new Error('db is null')

  db.data.cells = db.data.cells || []

  return {
    add: async ({ id = uuidv4(), ...data }) => {
      const cell = { ...data, id }
      db.data.cells.push(cell)
      await db.write()
      return cell
    },
    getList: async (projectId = null) => {
      if (projectId === null) return db.data.cells || []
      return (db.data.cells || []).filter(cell => cell.projectId === projectId)
    },
    get: async (id = null) => {
      return db.data.cells.find(c => c.id === id) || null
    },
    update: async (cell) => {
      const id = cell?.id || null
      if (id === null) throw new Error('cellId is not defined')

      const idx = db.data.cells.findIndex(c => c.id === id)
      if (idx < 0) throw new Error(`${id} is not defined cell`)

      db.data.cells.splice(idx, 1, cell)
      await db.write()
      return cell
    },
    delete: async (id = null) => {
      if (id === null) throw new Error('cellId is not defined')

      const idx = db.data.cells.findIndex((c) => c.id === id)
      if (idx < 0) return false

      db.data.cells.splice(idx, 1)
      await db.write()
      return true
    }
  }
}
