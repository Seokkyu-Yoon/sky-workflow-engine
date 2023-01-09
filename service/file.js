import { createWriteStream, mkdir } from 'node:fs'
import { resolve } from 'node:path'
import { File } from '../model/index.js'

function getDirPath ({ projectId = null, workflowId = null }) {
  const storagePath = process.env.WORKFLOW_STORAGE || './workflow-storage'
  if (projectId === null) return resolve(storagePath, 'public', 'file')
  if (workflowId === null) return resolve(storagePath, projectId, 'public', 'file')
  return resolve(storagePath, projectId, workflowId)
}
function getFilePath ({ id = null, extension = null }, dirpath) {
  if (id === null) throw new Error('id is null')
  const filename = `${id}.${extension}`
  return resolve(dirpath, filename)
}
function makeDir (dirpath) {
  return new Promise((resolve, reject) => {
    mkdir(dirpath, { recursive: true }, err => err ? reject(err) : resolve())
  })
}
function upload (filepath, stream) {
  const writeStream = createWriteStream(filepath, { flags: 'w' })
  return new Promise((resolve, reject) => {
    stream.pipe(writeStream)
      .on('error', err => reject(err))
      .on('finish', () => resolve())
  })
}

export function Service (dataAccess) {
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
      const dirpath = getDirPath(file)

      await makeDir(dirpath)

      const filepath = getFilePath(file, dirpath)
      await upload(filepath, stream)

      const cursor = await dataAccess.connect()
      await cursor.file.add(file)
      return file
    },
    getList: async ({ projectId = null, workflowId = null }) => {
      const cursor = await dataAccess.connect()
      const fileInfos = await cursor.file.getList(projectId, workflowId)
      console.log(fileInfos)
      const files = fileInfos.map(File)
      return files
    },
    get: async (id = null) => {
      const cursor = await dataAccess.connect()
      const fileInfo = await cursor.file.get(id)
      const file = File(fileInfo)
      return file
    },
    delete: async (id = null) => {
      const cursor = await dataAccess.connect()
      const fileInfo = await cursor.file.get(id)
      const file = File(fileInfo)
      return false
      // [TODO] remove file
      // const deleted = await cursor.file.delete(id)
      // return deleted
    }
  }
}
