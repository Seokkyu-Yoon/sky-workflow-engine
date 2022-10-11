import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import ejs from 'ejs'
import cors from 'cors'

import { MiddlewareLogger } from './middleware'

const { router } = require('./router')

export const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.engine('html', ejs.renderFile)

app.use(MiddlewareLogger())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', router)
