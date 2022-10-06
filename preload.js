
import path from 'path'
import moduleAlias from 'module-alias'
import * as dotenv from 'dotenv'

const root = path.resolve(require.main.path, '..')
function getPathStorage (pathStorage = path.resolve(root, 'workflow-storage')) {
  return path.normalize(pathStorage)
}
moduleAlias.addAlias('@', root)

dotenv.config()
process.env.PORT = process.env.PORT || 18830
process.env.PATH_STORAGE = getPathStorage(process.env.PATH_STORAGE)
