import { Router as Project } from './project.js'
import { Router as Workflow } from './workflow.js'
import { Router as Algorithm } from './algorithm.js'
import { Router as File } from './file.js'
import { Router as Engine } from './engine.js'

export function Router (Router, controller) {
  const router = Router()
  router
    .use('/projects', Project(Router, controller.project))
    .use('/workflows', Workflow(Router, controller.workflow))
    .use('/algorithms', Algorithm(Router, controller.algorithm))
    .use('/engines', Engine(Router, controller.engine))
    .use('/files', File(Router, controller.file))
  return router
}
