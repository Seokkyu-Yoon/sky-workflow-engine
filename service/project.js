import { Project } from '../model/index.js'

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
        const cells = await cursor.cell.getList(modelProject.id)
        return {
          ...modelProject,
          workflows: workflows.map(({ id, name }) => ({ id, name })),
          cells: cells.map(({ id, name }) => ({ id, name }))
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
      const workflows = await cursor.workflow.getList(id)
      const cells = await cursor.cell.getList(id)

      await Promise.all(workflows.map(wf => cursor.workflow.delete(wf.workflowId)))
      await Promise.all(cells.map(c => cursor.cell.delete(c.cellId)))

      const deleted = await cursor.project.delete(id)
      return deleted
    }
  }
}
