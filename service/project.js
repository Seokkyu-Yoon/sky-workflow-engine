import { rm } from 'node:fs'
import { resolve } from 'node:path'

import { service as storageService } from './storage.js'
import { Project } from '../model/index.js'

function getDirPath ({ id: projectId = null }) {
  const storagePath = process.env.WORKFLOW_STORAGE || './workflow-storage'
  if (projectId === null) throw new Error('projectId is not found')
  return resolve(storagePath, projectId)
}

export function Service (database) {
  return {
    add: async (projectInfo) => {
      const dbConnection = await database.connect()
      const project = Project(projectInfo)
      await dbConnection.project.add(project)
      return project
    },
    getList: async () => {
      const dbConnection = await database.connect()
      const projectInfos = await dbConnection.project.getList()
      const projects = await Promise.all(projectInfos.map(Project).map(async modelProject => {
        const workflows = await dbConnection.workflow.getList(modelProject.id)
        const algorithms = await dbConnection.algorithm.getList(modelProject.id)
        return {
          ...modelProject,
          workflows: workflows.map(({ id, name }) => ({ id, name })),
          algorithms: algorithms.map(({ id, name }) => ({ id, name }))
        }
      }))
      return projects
    },
    get: async (id = null) => {
      const dbConnection = await database.connect()
      const projectInfo = await dbConnection.project.get(id)
      const project = Project(projectInfo)
      return project
    },
    update: async ({ id = null, ...data }) => {
      const dbConnection = await database.connect()
      const projectInfo = await dbConnection.project.get(id)
      const project = Project(projectInfo)

      for (const key of Object.keys(project)) {
        if (typeof data[key] !== 'undefined') project[key] = data[key]
      }

      const projectInfoUpdated = await dbConnection.project.update(project)
      const projectUpdated = Project(projectInfoUpdated)
      return projectUpdated
    },
    delete: async (id = null) => {
      const dbConnection = await database.connect()
      const projectInfo = await dbConnection.project.get(id)
      const project = Project(projectInfo)
      const workflows = await dbConnection.workflow.getList(project.id)
      const algorithms = await dbConnection.algorithm.getList(project.id)
      const files = await dbConnection.file.getList(project.id)
      const dirpath = storageService.getProjectDirpath(project.id)

      await Promise.all([
        workflows.map(wf => dbConnection.workflow.delete(wf.id)),
        algorithms.map(a => dbConnection.algorithm.delete(a.id)),
        files.map(f => dbConnection.file.delete(f.id))
      ])
      await storageService.rmDir(dirpath)

      const deleted = await dbConnection.project.delete(id)
      return deleted
    }
  }
}
