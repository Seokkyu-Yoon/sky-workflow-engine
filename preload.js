import path from 'path'
import * as dotenv from 'dotenv'

const root = path.resolve(path.dirname(process.argv[1]), '..')
dotenv.config()

process.env.PORT = process.env.PORT || 8830
process.env.WORKFLOW_STORAGE = path.normalize(process.env.WORKFLOW_STORAGE || path.resolve(root, 'workflow-storage'))
