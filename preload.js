
import path from 'path'
import moduleAlias from 'module-alias'
import * as dotenv from 'dotenv'

const root = path.resolve(require.main.path, '..')
moduleAlias.addAlias('@', root)

dotenv.config()

process.env.PORT = process.env.PORT || 8830
process.env.WORKFLOW_STORAGE = path.normalize(process.env.WORKFLOW_STORAGE || path.resolve(root, 'workflow-storage'))
