import { createReadStream, createWriteStream, mkdir, rm, unlink } from 'node:fs'
import { createInterface } from 'node:readline'
import { resolve } from 'node:path'

const rootDirpath = process.env.WORKFLOW_STORAGE
export const service = {
  path: rootDirpath,
  mkDir: dirpath => new Promise((resolve, reject) => {
    mkdir(dirpath, { recursive: true }, err => err ? reject(err) : resolve())
  }),
  rmDir: dirpath => new Promise((resolve, reject) => {
    rm(dirpath, { recursive: true, force: true }, err => err ? reject(err) : resolve())
  }),
  rmFile: filepath => new Promise((resolve, reject) => {
    unlink(filepath, err => err ? reject(err) : resolve())
  }),
  getProjectDirpath: (projectId = null) => {
    if (projectId === null) throw new Error('projectId is not found')
    return resolve(service.path, projectId)
  },
  getWorkflowDirpath: (projectId = null, workflowId = null) => {
    if (workflowId === null) throw new Error('workflowId is not found')
    return resolve(service.getProjectDirpath(projectId), workflowId)
  },
  getPublicDirpath: (projectId = null, workflowId = null) => {
    if (projectId === null) return service.getProjectDirpath('public')
    if (workflowId === null) return service.getWorkflowDirpath(projectId, 'public')
    return resolve(service.getWorkflowDirpath(projectId, workflowId), 'public')
  },
  getAlgorithmDirpath: (projectId = null, workflowId = null) => {
    return resolve(service.getPublicDirpath(projectId, workflowId), 'algorithm')
  },
  getFileDirpath: (projectId = null, workflowId = null) => {
    return resolve(service.getPublicDirpath(projectId, workflowId), 'file')
  },
  getAlgorithmFilepath: ({ id = null, projectId = null, workflowId = null, extension = '' }) => {
    if (id === null) throw new Error('algorithm.id is not found')
    return resolve(service.getAlgorithmDirpath(projectId, workflowId), extension ? `${id}.${extension}` : id)
  },
  getFileFilepath: ({ id = null, projectId = null, workflowId = null, extension = '' }) => {
    if (id === null) throw new Error('file.id is not found')
    return resolve(service.getFileDirpath(projectId, workflowId), extension ? `${id}.${extension}` : id)
  },
  getNodeOutput: (projectId = null, workflowId = null, options = {}) => {
    const {
      nodeId = null,
      portId = null,
      start = 0,
      limit = 10
    } = options
    if (nodeId === null) throw new Error('options.nodeId is not found')
    if (portId === null) throw new Error('options.portId is not found')

    const workflowDirpath = service.getWorkflowDirpath(projectId, workflowId)
    const outputFilepath = resolve(workflowDirpath, `${nodeId}.${portId}`)
    return new Promise((resolve, reject) => {
      let cnt = 0
      const lines = []
      const rl = createInterface({
        input: createReadStream(outputFilepath),
        crlfDelay: Infinity
      }).on('line', onLine).on('close', onClose)

      function onLine (line) {
        cnt += 1
        if (cnt <= start) return
        if (cnt > start + limit) {
          rl.off('line', onLine)
          rl.close()
          return
        }
        lines.push(line)
      }
      function onClose () {
        resolve(lines)
      }
    })
  },
  uploadFile: async (file = null, readableStream) => {
    const fileDirpath = service.getFileDirpath(file.projectId, file.workflowId)
    await service.mkDir(fileDirpath)

    const fileFilepath = service.getFileFilepath(file)
    const writableStream = createWriteStream(fileFilepath, { flags: 'w' })
    return await new Promise((resolve, reject) => {
      readableStream.pipe(writableStream)
        .on('error', err => reject(err))
        .on('finish', () => resolve())
    })
  }
}
