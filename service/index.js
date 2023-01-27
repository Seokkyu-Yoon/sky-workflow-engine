import { Database } from '../database/index.js'
import { Service as Project } from './project.js'
import { Service as Workflow } from './workflow.js'
import { Service as Algorithm } from './algorithm.js'
import { Service as Engine } from './engine/index.js'
import { Service as File } from './file.js'
import { service as storage } from './storage.js'

const database = await Database()
export const project = Project(database)
export const workflow = Workflow(database)
export const algorithm = Algorithm(database)
export const file = File(database)
export { storage }
export const engine = Engine(algorithm, file, storage, workflow)
