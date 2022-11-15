import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import ejs from 'ejs'
import cors from 'cors'

import { MiddlewareLogger } from './middleware/index.js'

import { Router } from './router/index.js'
import { fileURLToPath } from 'url'

export const app = express()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// view engine setup
app.set('views', path.join(__dirname, 'public'))
app.set('view engine', 'ejs')
app.engine('html', ejs.renderFile)

app.use(MiddlewareLogger())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', Router())
