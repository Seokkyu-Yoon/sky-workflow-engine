import { service as storageService } from './storage.js'
import { File } from '../model/index.js'

export function Service (database) {
  return {
    add: async (body) => {
      const projectId = body?.projectId || null
      const workflowId = body?.workflowId || null
      const filename = body?.file?.filename || ''
      const extSepPos = filename.lastIndexOf('.') || filename.length
      const name = filename.slice(0, extSepPos) || ''
      const extension = filename.slice(extSepPos + 1) || null

      const stream = body?.file?.stream || null
      const size = stream?._readableState?.length || 0

      const fileInfo = { projectId, workflowId, name, extension, size }
      const file = File(fileInfo)

      await storageService.uploadFile(file, stream)

      const dbConnection = await database.connect()
      await dbConnection.file.add(file)
      return file
    },
    getList: async ({ projectId = null, workflowId = null }) => {
      const dbConnection = await database.connect()
      const fileInfos = await dbConnection.file.getList(projectId, workflowId)
      console.log(fileInfos)
      const files = fileInfos.map(File)
      return files
    },
    get: async (id = null) => {
      const dbConnection = await database.connect()
      const fileInfo = await dbConnection.file.get(id)
      const file = File(fileInfo)
      return file
    },
    delete: async (id = null) => {
      const dbConnection = await database.connect()
      const fileInfo = await dbConnection.file.get(id)
      const file = File(fileInfo)

      const filepath = storageService.getFileFilepath(file)
      await storageService.rmFile(filepath)

      const deleted = await dbConnection.file.delete(id)
      return deleted
    }
  }
}
