import { v4 as uuidv4 } from 'uuid'

export function File (db = null) {
  if (db === null) throw new Error('db is null')

  db.data.files = db.data.files || []

  return {
    add: async ({ id = uuidv4(), ...data }) => {
      const file = { ...data, id }
      db.data.files.push(file)
      await db.write()
      return file
    },
    getList: async (projectId = null, workflowId = null) => {
      if (projectId === null) return db.data.files || []
      if (workflowId === null) return (db.data.files || []).filter(f => f.projectId === projectId)
      return (db.data.files || []).filter(f => f.projectId === projectId && f.workflowId === workflowId)
    },
    get: async (id = null) => {
      return db.data.files.find(f => f.id === id) || null
    },
    delete: async (id = null) => {
      if (id === null) throw new Error('fileId is not defined')

      const idx = db.data.files.findIndex(f => f.id === id)
      if (idx < 0) return false

      db.data.files.splice(idx, 1)
      await db.write()
      return true
    }
  }
}
