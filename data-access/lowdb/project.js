import { v4 as uuidv4 } from 'uuid'

export function Project (db = null) {
  if (db === null) throw new Error('db is null')

  db.data.projects = db.data.projects || []

  return {
    add: async ({ projectId = uuidv4(), ...data }) => {
      const project = { ...data, projectId }
      db.data.projects.push(project)
      await db.write()
      return project
    },
    getList: async () => {
      return db.data.projects || []
    },
    get: async (projectId = null) => {
      return db.data.projects.find((p) => p.projectId === projectId) || null
    },
    update: async ({ projectId = null, ...data }) => {
      if (projectId === null) throw new Error('projectId is not defined')

      const idx = db.data.projects.findIndex((p) => p.projectId === projectId)
      if (idx < 0) throw new Error(`${projectId} is not defined project`)

      const project = { ...data, projectId }
      db.data.projects.splice(idx, 1, project)
      await db.write()
      return project
    },
    delete: async (projectId = null) => {
      if (projectId === null) throw new Error('projectId is not defined')

      const idx = db.data.projects.findIndex((p) => p.projectId === projectId)
      if (idx < 0) return false

      db.data.projects.splice(idx, 1)
      await db.write()
      return true
    }
  }
}
