import { Router } from 'express'

import { router as routerV1 } from './v1/index.js'

export const router = Router()

router
  .use('/v1', routerV1)
