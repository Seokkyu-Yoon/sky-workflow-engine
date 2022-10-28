import { ModelProject } from '../model/index.js'
import { DataAccess } from '../data-access/index.js'

const dataAccess = await DataAccess()

export const service = {
  add: async (projectInfo) => {
    const project = ModelProject(projectInfo)
    await dataAccess.projects.add(project)
    return project
  },
  getList: async () => {
    const projectInfos = await dataAccess.projects.getList()
    const projects = projectInfos.map(ModelProject)
    return projects
  },
  get: async (projectId = null) => {
    const projectInfo = await dataAccess.projects.get(projectId)
    const project = ModelProject(projectInfo)
    return project
  },
  update: async (projectInfo) => {
    const project = ModelProject(projectInfo)
    await dataAccess.projects.update(project)
    return project
  },
  delete: async (projectId = null) => {
    const deleted = await dataAccess.projects.delete(projectId)
    return deleted
  }
}
