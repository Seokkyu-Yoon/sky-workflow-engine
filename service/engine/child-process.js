import { spawn } from 'node:child_process'
import * as status from './status.js'
export function ChildProcess (spec) {
  let stopped = false
  let childProcess = null
  return {
    run: () => new Promise((resolve, reject) => {
      let err = null
      try {
        childProcess = spawnPython(spec)
        childProcess.stderr.on('data', data => {
          err = new Error(data.toString())
        })
        childProcess.stdout.on('data', data => {
          console.log(data.toString())
        })
        childProcess.on('exit', code => {
          console.log('********************* stopped')
          if (stopped) return resolve({ status: status.STOPPED })
          if (code !== 0) return reject(err)
          resolve({ status: status.FINISHED })
        })
        childProcess.stdin.write(JSON.stringify(spec, null, 2))
        childProcess.stdin.end()
      } catch (err) {
        reject(err)
      }
    }),
    stop: () => {
      if (childProcess && !childProcess.killed) {
        stopped = true
        childProcess.kill()
      }
    }
  }
}
ChildProcess.Dummy = function (spec) {
  let childProcess = null
  return {
    run: () => new Promise((resolve, reject) => {
      let err = null
      try {
        childProcess = spawnDummy(spec)
        childProcess.stderr.on('data', data => {
          err = new Error(data.toString())
        })
        childProcess.stdout.on('data', data => {
          console.log(data.toString())
        })
        childProcess.on('exit', code => {
          if (code !== 0) return reject(err)
          resolve()
        })
        childProcess.stdin.write(JSON.stringify(spec, null, 2))
        childProcess.stdin.end()
      } catch (err) {
        reject(err)
      }
    }),
    stop: () => new Promise((resolve) => {
      if (childProcess && !childProcess.killed) {
        resolve(childProcess.kill())
        return
      }
      resolve()
    })
  }
}
function spawnPython (spec) {
  return spawn('python', [])
}
function spawnDummy () {
  return spawn('node', [`${process.env.WORKFLOW_STORAGE}/public/algorithm/dummy.js`])
}
