import { Router } from 'express'

import { ControllerProject } from '../../../controller/index.js'
import { serviceProject, serviceWorkflow } from '../../../service/index.js'

const controllerProject = ControllerProject(serviceProject, serviceWorkflow)

export const router = Router()

router
  .post('/', controllerProject.add)
  .get('/', controllerProject.getList)

router
  .get('/:projectId', controllerProject.get)
  .put('/:projectId', controllerProject.update)
  .delete('/:projectId', controllerProject.delete)

router
  .get('/:projectId/workflows', controllerProject.getWorkflows)
