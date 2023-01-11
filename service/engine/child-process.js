import { resolve } from 'node:path'
import { spawn } from 'node:child_process'

export function ChildProcess (algorithm, spec) {
  let childProcess = null
  return {
    run: () => new Promise((resolve, reject) => {
      let err = null
      try {
        // childProcess = spawnPython(spec)
        // for test
        if (algorithm?.type === 'python') {
          childProcess = spawnPython(algorithm, spec)
        } else {
          childProcess = spawnDummy(algorithm, spec)
        }
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
    stop: () => {
      if (childProcess && !childProcess.killed) {
        childProcess.kill()
      }
    }
  }
}
function spawnPython (algorithm, spec) {
  return spawn('python', [resolve(process.env.WORKFLOW_STORAGE, 'public', 'algorithm', `${algorithm.id}.py`)])
}
function spawnDummy (algorithm, spec) {
  return spawn('node', [resolve(process.env.WORKFLOW_STORAGE, 'public', 'algorithm', 'dummy.js')])
}
