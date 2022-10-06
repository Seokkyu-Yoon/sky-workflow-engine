import { Router } from 'express'

export const router = Router()

router.use('/', async (req, res, next) => {
  res.render('index.html')
})

router.use(async (err, req, res, next) => {
  // render the error page
  res.status(err.status || 500)
  res.send(err.message)
})
