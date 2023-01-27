import { v4 as uuidv4 } from 'uuid'

export function Workflow (db = null) {
  if (db === null) throw new Error('db is null')

  db.data.workflows = db.data.workflows || []

  return {
    add: async ({ id = uuidv4(), ...data }) => {
      const workflow = { ...data, id }
      db.data.workflows.push(workflow)
      await db.write()
      return workflow
    },
    getList: async (projectId = null) => {
      if (projectId === null) return db.data.workflows || []
      return (db.data.workflows || []).filter(workflow => workflow.projectId === projectId)
    },
    get: async (id = null) => {
      return db.data.workflows.find(w => w.id === id) || null
    },
    update: async (workflow) => {
      const id = workflow?.id || null
      if (id === null) throw new Error('workflowId is not defined')

      const idx = db.data.workflows.findIndex(w => w.id === id)
      if (idx < 0) throw new Error(`${id} is not defined workflow`)

      db.data.workflows.splice(idx, 1, workflow)
      await db.write()
      return workflow
    },
    delete: async (id = null) => {
      if (id === null) throw new Error('workflowId is not defined')

      const idx = db.data.workflows.findIndex(w => w.id === id)
      if (idx < 0) return false

      db.data.workflows.splice(idx, 1)
      await db.write()
      return true
    }
  }
}
