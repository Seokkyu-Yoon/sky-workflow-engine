import { Project } from '../model/index.js'

export function Service (dataAccess) {
  return {
    add: async (projectInfo) => {
      const project = Project(projectInfo)
      await dataAccess.project.add(project)
      return project
    },
    getList: async () => {
      const projectInfos = await dataAccess.project.getList()
      const projects = await Promise.all(projectInfos.map(Project).map(async modelProject => {
        const workflows = await dataAccess.workflows.getList(modelProject.id)
        const cells = await dataAccess.cells.getList(modelProject.id)
        return {
          ...modelProject,
          workflows: workflows.map(({ id, name }) => ({ id, name })),
          cells: cells.map(({ id, name }) => ({ id, name }))
        }
      }))
      return projects
    },
    get: async (id = null) => {
      const projectInfo = await dataAccess.project.get(id)
      const project = Project(projectInfo)
      return project
    },
    update: async ({ id = null, ...data }) => {
      const projectInfo = await dataAccess.project.get(id)
      const project = Project(projectInfo)

      for (const key of Object.keys(project)) {
        if (typeof data[key] !== 'undefined') project[key] = data[key]
      }

      const projectInfoUpdated = await dataAccess.project.update(project)
      const projectUpdated = Project(projectInfoUpdated)
      return projectUpdated
    },
    delete: async (id = null) => {
      const workflows = await dataAccess.workflows.getList(id)
      const cells = await dataAccess.cells.getList(id)

      await Promise.all(workflows.map(wf => dataAccess.workflows.delete(wf.workflowId)))
      await Promise.all(cells.map(c => dataAccess.cells.delete(c.cellId)))

      const deleted = await dataAccess.project.delete(id)
      return deleted
    }
  }
}
