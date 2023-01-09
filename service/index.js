import { DataAccess } from '../data-access/index.js'
import { Service as Project } from './project.js'
import { Service as Workflow } from './workflow.js'
import { Service as Algorithm } from './algorithm.js'
import { Service as Engine } from './engine/index.js'
import { Service as File } from './file.js'

const dataAccess = await DataAccess()
export const project = Project(dataAccess)
export const workflow = Workflow(dataAccess)
export const algorithm = Algorithm(dataAccess)
export const engine = Engine(dataAccess)
export const file = File(dataAccess)
