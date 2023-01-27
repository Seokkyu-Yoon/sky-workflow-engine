import { v4 as uuidv4 } from 'uuid'

export function Project (db = null) {
  if (db === null) throw new Error('db is null')

  db.data.projects = db.data.projects || []

  const project = {
    add: async ({ id = uuidv4(), ...data }) => {
      const p = { ...data, id }
      if (await project.get(id) !== null) throw new Error('project id is already exists')
      db.data.projects.push(p)
      await db.write()
      return p
    },
    getList: async () => {
      return db.data.projects || []
    },
    get: async (id = null) => {
      console.log(db.data.projects, id)
      return db.data.projects.find(p => p.id === id) || null
    },
    update: async (project) => {
      const id = project?.id || null
      if (id === null) throw new Error('projectId is not defined')

      const idx = db.data.projects.findIndex(p => p.id === id)
      if (idx < 0) throw new Error(`${id} is not defined project`)

      db.data.projects.splice(idx, 1, project)
      await db.write()
      return project
    },
    delete: async (id = null) => {
      if (id === null) throw new Error('projectId is not defined')

      const idx = db.data.projects.findIndex(p => p.id === id)
      if (idx < 0) return false

      db.data.projects.splice(idx, 1)
      await db.write()
      return true
    }
  }
  return project
}
