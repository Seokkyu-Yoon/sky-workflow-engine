import { spawn } from 'node:child_process'

import * as status from './status.js'

export function RunnableNode ({ spawnInfo, specInfo }) {
  let nodeStatus = status.READY
  let instance = null
  const id = specInfo.id
  function getStatus () {
    return nodeStatus
  }
  function run () {
    return new Promise((resolve, reject) => {
      nodeStatus = status.RUNNING
      let error = null
      instance = spawn(...spawnInfo)
      instance.on('error', err => {
        nodeStatus = status.ERROR
        reject(err)
      })
      instance.on('exit', code => {
        const stopped = nodeStatus === status.STOPPED
        const finished = code === 0
        if (!stopped) nodeStatus = finished ? status.FINISHED : status.ERROR
        finished ? resolve() : reject(error)
      })
      instance.stderr.on('data', data => {
        error = new Error(data.toString())
      })
      instance.stdout.on('data', data => console.log(data.toString()))
      instance.stdin.write(JSON.stringify(specInfo, null, 2))
      instance.stdin.end()
    })
  }
  function stop () {
    if (nodeStatus !== status.RUNNING) return
    if (instance === null) return
    instance.kill()
    nodeStatus = status.STOPPED
  }
  return {
    id,
    getStatus,
    run,
    stop
  }
}

RunnableNode.InfoMakerFactory = function (algorithmService, fileService, storageService) {
  const infoMakerFactory = InfoMaker
  async function getSpawnInfo (node) {
    const { algorithmId } = node
    const algorithm = await algorithmService.get(algorithmId)

    let cmd = 'node'
    let extension = 'js'
    if (algorithm.type === 'python') {
      cmd = process.env.PYTHON || 'python3'
      extension = 'py'
    }
    const algorithmFilepath = await storageService.getAlgorithmFilepath({ ...algorithm, extension })
    return [cmd, [algorithmFilepath]]
  }
  function InfoMaker (env, connectionMap) {
    const infoMaker = makeInfo
    async function getSpec (node) {
      const {
        id,
        inPorts,
        outPorts,
        params
      } = node
      const connection = connectionMap.get(id)
      return {
        id,
        env,
        inputs: inPorts.map(inPortId => connection.inPortMap.get(inPortId) || inPortId),
        outputs: outPorts,
        params: Object.fromEntries(
          await Promise.all(params.map(async ({ type, key, value }) => {
            if (type === 'file') {
              const fileId = value
              const file = await fileService.get(fileId)
              const filepath = await storageService.getFileFilepath(file)
              return [key, filepath]
            }
            return [key, value]
          }))
        )
      }
    }
    async function makeInfo (node) {
      const spawnInfo = await getSpawnInfo(node)
      const specInfo = await getSpec(node, env, connectionMap)
      return {
        spawnInfo,
        specInfo
      }
    }
    return infoMaker
  }
  return infoMakerFactory
}
