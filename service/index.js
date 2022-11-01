import { DataAccess } from '../data-access/index.js'
import { Service as ProjectService } from './project.js'
import { Service as WorkflowService } from './workflow.js'
import { Service as CellService } from './cell.js'

const dataAccess = await DataAccess()
export const projectService = ProjectService(dataAccess)
export const workflowService = WorkflowService(dataAccess)
export const cellService = CellService(dataAccess)

export const services = {
  project: projectService,
  workflow: workflowService,
  cell: cellService
}
