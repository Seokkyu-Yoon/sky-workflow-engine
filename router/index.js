import { Router } from 'express'

import { router as routerApi } from './api/index.js'

import { ControllerRender, ControllerError } from '../controller/index.js'

const controllerRender = ControllerRender()
const controllerError = ControllerError()

export const router = Router()

router
  .use('/api', routerApi)
  .use('/', controllerRender.render)
  .use(controllerError.error)
