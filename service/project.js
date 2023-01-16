import { rm } from 'node:fs'
import { resolve } from 'node:path'

import { Project } from '../model/index.js'

function getDirPath ({ id: projectId = null }) {
  const storagePath = process.env.WORKFLOW_STORAGE || './workflow-storage'
  if (projectId === null) throw new Error('projectId is not found')
  return resolve(storagePath, projectId)
}
function rmDir (dirpath) {
  return new Promise((resolve, reject) => {
    rm(dirpath, { recursive: true, force: true }, err => err ? reject(err) : resolve())
  })
}

/**
 * @param {{connect: () => Promise<Cursor>}} dataAccess
 */
export function Service (dataAccess) {
  return {
    add: async (projectInfo) => {
      const cursor = await dataAccess.connect()
      const project = Project(projectInfo)
      await cursor.project.add(project)
      return project
    },
    getList: async () => {
      const cursor = await dataAccess.connect()
      const projectInfos = await cursor.project.getList()
      const projects = await Promise.all(projectInfos.map(Project).map(async modelProject => {
        const workflows = await cursor.workflow.getList(modelProject.id)
        const algorithms = await cursor.algorithm.getList(modelProject.id)
        return {
          ...modelProject,
          workflows: workflows.map(({ id, name }) => ({ id, name })),
          algorithms: algorithms.map(({ id, name }) => ({ id, name }))
        }
      }))
      return projects
    },
    get: async (id = null) => {
      const cursor = await dataAccess.connect()
      const projectInfo = await cursor.project.get(id)
      const project = Project(projectInfo)
      return project
    },
    update: async ({ id = null, ...data }) => {
      const cursor = await dataAccess.connect()
      const projectInfo = await cursor.project.get(id)
      const project = Project(projectInfo)

      for (const key of Object.keys(project)) {
        if (typeof data[key] !== 'undefined') project[key] = data[key]
      }

      const projectInfoUpdated = await cursor.project.update(project)
      const projectUpdated = Project(projectInfoUpdated)
      return projectUpdated
    },
    delete: async (id = null) => {
      const cursor = await dataAccess.connect()
      const projectInfo = await cursor.project.get(id)
      const project = Project(projectInfo)
      const workflows = await cursor.workflow.getList(project.id)
      const algorithms = await cursor.algorithm.getList(project.id)
      const dirpath = getDirPath(project)

      await Promise.all(workflows.map(wf => cursor.workflow.delete(wf.id)))
      await Promise.all(algorithms.map(a => cursor.algorithm.delete(a.id)))
      await rmDir(dirpath)

      const deleted = await cursor.project.delete(id)
      return deleted
    }
  }
}
