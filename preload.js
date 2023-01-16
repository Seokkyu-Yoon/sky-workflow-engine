import path from 'path'
import fs from 'fs'
import * as dotenv from 'dotenv'

const root = path.resolve(path.dirname(process.argv[1]), '..')
dotenv.config()

process.env.PORT = process.env.PORT || 8830
process.env.WORKFLOW_STORAGE = path.normalize(process.env.WORKFLOW_STORAGE || path.resolve(root, 'workflow-storage'))
process.env.PYTHON = process.env.PYTHON || 'python'

fs.mkdirSync(process.env.WORKFLOW_STORAGE, { recursive: true })
fs.mkdirSync(path.resolve(process.env.WORKFLOW_STORAGE, 'public'), { recursive: true })
fs.mkdirSync(path.resolve(process.env.WORKFLOW_STORAGE, 'public', 'file'), { recursive: true })
fs.mkdirSync(path.resolve(process.env.WORKFLOW_STORAGE, 'public', 'algorithm'), { recursive: true })
