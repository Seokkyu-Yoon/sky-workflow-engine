import path from 'path'

const pathStorage = path.resolve(process.env.WORKFLOW_STORAGE)

export const config = {
  path: path.resolve(pathStorage, 'mdt.db.json')
}
