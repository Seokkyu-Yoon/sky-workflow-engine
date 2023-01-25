import { spawn } from 'node:child_process'

import { getTypeInfo } from './type.js'
import { service as storageService } from '../storage.js'

export function ChildProcess (algorithm, spec) {
  let childProcess = null
  return {
    run: () => new Promise((resolve, reject) => {
      let err = null
      childProcess = createChildProcess(algorithm)
      childProcess.on('error', err => reject(err))
      childProcess.on('exit', code => {
        if (code !== 0) {
          return reject(err)
        }
        resolve()
      })
      childProcess.stderr.on('data', data => {
        err = new Error(data.toString())
      })
      childProcess.stdout.on('data', data => {
        console.log(data.toString())
      })
      childProcess.stdin.write(JSON.stringify(spec, null, 2))
      childProcess.stdin.end()
    }),
    stop: () => {
      if (childProcess && !childProcess.killed) {
        childProcess.kill()
      }
    }
  }
}

function createChildProcess (algorithm) {
  const type = algorithm?.type || null
  const { runCmd, extension } = getTypeInfo(type)

  const algorithmFilepath = storageService.getAlgorithmFilepath({ ...algorithm, extension })
  return spawn(runCmd, [algorithmFilepath])
}
