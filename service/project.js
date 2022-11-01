import { ModelProject } from '../model/index.js'

export function Service (dataAccess) {
  return {
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
    update: async ({ projectId = null, ...data }) => {
      const projectInfo = await dataAccess.projects.get(projectId)
      const project = ModelProject(projectInfo)
      for (const key of Object.keys(project)) {
        if (typeof data[key] !== 'undefined') project[key] = data[key]
      }
      const projectInfoUpdated = await dataAccess.projects.update(project)
      const projectUpdated = ModelProject(projectInfoUpdated)
      return projectUpdated
    },
    delete: async (projectId = null) => {
      const workflows = await dataAccess.workflows.getList(projectId)
      const cells = await dataAccess.cells.getList(projectId)

      await Promise.all(workflows.map(wf => dataAccess.workflows.delete(wf.workflowId)))
      await Promise.all(cells.map(c => dataAccess.cells.delete(c.cellId)))

      const deleted = await dataAccess.projects.delete(projectId)
      return deleted
    }
  }
}
