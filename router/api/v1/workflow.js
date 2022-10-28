import { Router } from 'express'

import { ControllerWorkflow } from '../../../controller/index.js'
import { serviceWorkflow } from '../../../service/index.js'

const controllerWorkflow = ControllerWorkflow(serviceWorkflow)

export const router = Router()

router
  .post('/', controllerWorkflow.add)
  .get('/', controllerWorkflow.getList)

router
  .get('/:workflowId', controllerWorkflow.get)
  .put('/:workflowId', controllerWorkflow.update)
  .delete('/:workflowId', controllerWorkflow.delete)

router
  .get('/:workflowId/ui', controllerWorkflow.getUi)
