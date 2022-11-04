import { DataAccess } from '../data-access/index.js'
import { Service as Project } from './project.js'
import { Service as Workflow } from './workflow.js'
import { Service as Cell } from './cell.js'

const dataAccess = await DataAccess()
export const project = Project(dataAccess)
export const workflow = Workflow(dataAccess)
export const cell = Cell(dataAccess)
