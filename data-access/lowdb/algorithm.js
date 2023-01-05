import { v4 as uuidv4 } from 'uuid'

export function Algorithm (db = null) {
  if (db === null) throw new Error('db is null')

  db.data.algorithms = db.data.algorithms || []

  return {
    add: async ({ id = uuidv4(), ...data }) => {
      const algorithm = { ...data, id }
      db.data.algorithms.push(algorithm)
      await db.write()
      return algorithm
    },
    getList: async (projectId = null) => {
      if (projectId === null) return db.data.algorithms || []
      return (db.data.algorithms || []).filter(a => a.projectId === projectId)
    },
    get: async (id = null) => {
      return db.data.algorithms.find(a => a.id === id) || null
    },
    update: async (algorithm) => {
      const id = algorithm?.id || null
      if (id === null) throw new Error('algorithmId is not defined')

      const idx = db.data.algorithms.findIndex(a => a.id === id)
      if (idx < 0) throw new Error(`${id} is not defined algorithm`)

      db.data.algorithms.splice(idx, 1, algorithm)
      await db.write()
      return algorithm
    },
    delete: async (id = null) => {
      if (id === null) throw new Error('algorithmId is not defined')

      const idx = db.data.algorithms.findIndex(a => a.id === id)
      if (idx < 0) return false

      db.data.algorithms.splice(idx, 1)
      await db.write()
      return true
    }
  }
}
